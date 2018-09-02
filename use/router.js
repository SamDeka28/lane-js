// imports
const url = require('url')
const fs = require('fs')
const http = require('http')
const readFile = fs.readFileSync
const queryString = require('querystring')
const config = require("../../../configs/config.json")
const path = require("path")
const registered_path = require("../../../configs/paths.map.json")
const ejs = require("ejs")
const pathmap = require("../../../configs/paths.map.json")
const middleware = require("./middleware")
const serveStatic = require("./serveStatics")
const routeGen = require("./routegenerate")
const registerPaths = require("./registerPaths")
const { render, ejsrender } = require("./render")
const matchPathname = require("./common/matchPath")
const paramParser = require("./common/paramParser")
// this function expression is called when the generatePathMap route is hitted. It basically 
// is used to check the type of the path of the specified route (LaneJs.io provides multiple pathname
// per route). So, if multiple pathname is specified for a route, it itterates over the array object,
// and call the registerPath function for each pathname
var callToRegisterPath = path => typeof (path) == "object" ? path.forEach(lane => { registerPaths(lane) }) : registerPaths(path)

// Function Signature: route(path : String/Array, httpload : JSON {request,response}, 
// callback : Function (params ==>(serverRequest,serverResponse,queryString:optional)))
// queryStrings in the callback can be accessed by the queryString object's 'get' key
// the server request object will be available through the 1st parameter of the callback
// the server response object will be available through the 2nd parameter of the callback
function route(request, response, serverOption) {
    //modify the req and res if middleware exists
    let { req, res } = middleware(serverOption, request, response)
    let load = { request: req, response: res }
    //creates a parsed url object from the url
    let urlOb = url.parse(req.url)
    //extract the pathname from the parsed url object
    let path = urlOb.pathname
    console.log(req.method, path, response.statusCode)
    return {
        // this is GET Http method function expression. All the Http method function expression takes
        // three arguments, the pathspec is the pathname(string | Array) specified when creating the route,
        // the load has the req and res object passed from the route which can be accessed as load.req or load.res,
        // and the callback handler for the route
        //
        get: async (pathspec, callback) => {
            // callToRegiterPath is used to generate path maps, this method get fired only when the generatePathMap
            // route is called

            routeGen.routegeneration ? callToRegisterPath(pathspec) : res.end("Un-authorized")

            // checks if the HTTP method is GET
            if (req.method == "GET") {

                // extractParams(pathname,pathspec)
                req.params = paramParser(path, pathspec)
                try {
                    pathspec = typeof pathspec == 'object' ? pathspec : [pathspec]
                    var pathname = matchPathname(path, pathspec)
                } catch (err) {
                    pathspec(err)
                }
                //parse the queryString if any
                let rawQuery = queryString.parse(urlOb.query)

                rawQuery ? req.query = rawQuery : null
                // because the generatePathMap is of type HTTP GET method, when the route is called,
                // the path pathname is checked and if is a generatePathMap call, then return a simple
                // success response 
                if (pathname == "/generatePathMap") {
                    res.end("Path map generated successfully")
                }

                // serves the statics associated with a html file, such as bootstrap, jquery etc
                serveStatic(load, pathspec, pathname)

                // checks for the type of the specified path, if the specified path is of Object type,
                // then it checks if the pathname is included in the pathname, and call the callback else
                // simply calls the callback function specified in the route
                await callCallBack(pathspec, pathname, callback, req, res);
            } else {
                invalidHttp(res);
            }
        },
        delete: async (pathspec, callback) => {

            routeGen.routegeneration ? callToRegisterPath(pathspec) : res.end("Un-authorized")

            // extractParams(pathname,pathspec)
            req.params = paramParser(path, pathspec)
            try {
                pathspec = typeof pathspec == 'object' ? pathspec : [pathspec]
                var pathname = matchPathname(path, pathspec)
            } catch (err) {
                pathspec(err)
            }

            if (req.method == "DELETE") {

                let rawQuery = queryString.parse(urlOb.query)

                rawQuery ? req.query = rawQuery : null

                if (pathname == "/generatePathMap") {
                    res.end("Path map generated successfully")
                }

                serveStatic(load, pathspec, pathname)

                await callCallBack(pathspec, pathname, callback, req, res);
            } else {
                invalidHttp(res);
            }
        },
        post: (pathspec, callback) => {

            routeGen.routegeneration ? callToRegisterPath(pathspec) : res.end("Un-authorized")

            if (req.method === "POST") {

                // extractParams(pathname,pathspec)
                req.params = paramParser(path, pathspec)
                try {
                    pathspec = typeof pathspec == 'object' ? pathspec : [pathspec]
                    var pathname = matchPathname(path, pathspec)
                } catch (err) {
                    console.log(err)
                }

                var rawQuery = queryString.parse(urlOb.query)

                // declared an empty buffer
                var buffer = ""
                var body = {}

                // utilizing the on data event for creating the data from the posted data buffer
                req.on('data', function (data) {
                    buffer += data.toString()
                })

                req.on("end", async function () {
                    // on successfull extraction of the post data, the body is parsed and stored in the body object
                    body = queryString.parse(buffer)
                    rawQuery ? req.query = rawQuery : null
                    body ? req.body = body : null
                    await callCallBack(pathspec, pathname, callback, req, res);
                })
            } else {
                invalidHttp(res)
            }
        },
        all: (pathspec, callback) => {

            routeGen.routegeneration ? callToRegisterPath(pathspec) : res.end("Un-authorized")

            // extractParams(pathname,pathspec)
            req.params = paramParser(path, pathspec)
            try {
                pathspec = typeof pathspec == 'object' ? pathspec : [pathspec]
                var pathname = matchPathname(path, pathspec)
            } catch (err) {
                console.log(err)
            }

            var rawQuery = queryString.parse(urlOb.query)
            var buffer = ""
            var body

            if (pathname == "/generatePathMap") {
                res.end("Path map generated successfully")
            }

            serveStatic(load, pathspec, pathname);

            req.on('data', function (data) {
                buffer += data.toString()
            })

            req.on("end", async function () {
                body = queryString.parse(buffer)
                rawQuery ? req.query = rawQuery : null
                body ? req.body = body : null
                await callCallBack(pathspec, pathname, callback, req, res)
            })
        },
        put: (pathspec, callback) => {

            routeGen.routegeneration ? callToRegisterPath(pathspec) : res.end("Un-authorized")

            if (load.request.method == 'PUT') {

                // extractParams(pathname,pathspec)
                req.params = paramParser(path, pathspec)
                try {
                    pathspec = typeof pathspec == 'object' ? pathspec : [pathspec]
                    var pathname = matchPathname(path, pathspec)
                } catch (err) {
                    console.log(err)
                }

                var rawQuery = queryString.parse(urlOb.query)
                var buffer = ""
                var body

                if (pathname == "/generatePathMap") {
                    res.end("Path map generated successfully")
                }

                serveStatic(load, pathspec, pathname);

                req.on('data', function (data) {
                    buffer += data.toString()
                })

                req.on("end", async function () {
                    body = queryString.parse(buffer)
                    rawQuery ? req.query = rawQuery : null
                    body ? req.body = body : null
                    await callCallBack(pathspec, pathname, callback, req, res);
                })
            } else {
                invalidHttp(res)
            }
        },
        patch: (pathspec, callback) => {

            routeGen.routegeneration ? callToRegisterPath(pathspec) : res.end("Un-authorized")

            if (req.method == 'PATCH') {
                // extractParams(pathname,pathspec)
                req.params = paramParser(path, pathspec)
                try {
                    pathspec = typeof pathspec == 'object' ? pathspec : [pathspec]
                    var pathname = matchPathname(path, pathspec)
                } catch (err) {
                    console.log(err)
                }

                var rawQuery = queryString.parse(urlOb.query)
                // console.log(rawQuery)
                var buffer = ""
                var body

                if (pathname == "/generatePathMap") {
                    res.end("Path map generated successfully")
                }

                serveStatic(load, pathspec, pathname);


                req.on('data', function (data) {
                    buffer += data.toString()
                })

                req.on("end", async function () {
                    body = queryString.parse(buffer)
                    rawQuery ? req.query = rawQuery : null
                    body ? req.body = body : null
                    await callCallBack(pathspec, pathname, callback, req, res);
                })
            } else {
                invalidHttp(res)
            }
        }
    }
}

async function callCallBack(pathspec, pathname, callback, req, res) {
    if (typeof (pathspec) == 'object') {
        if (pathspec.includes(pathname)) {
            try {
                // the call back has three arguments, the req and res object and a object that contains
                // the parsed query string object the is exposed throught the get key
                await callback(null, req, res);
            }
            catch (err) {
                await callback(err, req, res);
            }
        }
    }
    else if (pathspec == pathname) {
        try {
            await callback(null, req, res);
        }
        catch (err) {
            await callback(err, req, res);
        }
    }
}

function invalidHttp(res) {
    err = { status: 400, message: "400 Bad Request" };
    res.end(JSON.stringify(err));
}

// Function Redirect :
// Performs a http redirect
// Requires 2 parameters , the redirection location and the server response object
var redirect = (loc, res) => {
    res.writeHead(302, { Location: loc })
    res.end()
}

// renders a 404 html template
let err404 = async (req, res) => {
    let content = await ejsrender(__dirname + "/statics/error/404.html", { req: req, res: res, data: { name: "Error :::: 404 Page not found" } })
    res.end(content)
}

//exporting the route, render, redirect, serveStatic method
module.exports.render = render
module.exports.redirect = redirect
module.exports.serve = serveStatic
module.exports.error = { "404": err404 }
module.exports.route = route