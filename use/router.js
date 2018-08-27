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

// this function expression is called when the generatePathMap route is hitted. It basically 
// is used to check the type of the path of the specified route (LaneJs.io provides multiple pathname
// per route). So, if multiple pathname is specified for a route, it itterates over the array object,
// and call the registerPath function for each pathname
var callToRegisterPath = path => typeof (path) == "object" ? path.forEach(lane => { registerPaths(lane) }) : registerPaths(path)

// var pre_register_path = []

// this is GET Http method function expression. All the Http method function expression takes
// three arguments, the pathspec is the pathname(string | Array) specified when creating the route,
// the load has the req and res object passed from the route which can be accessed as load.req or load.res,
// and the callback handler for the route
//
// Function Signature: route(path : String/Array, httpload : JSON {request,response}, 
// callback : Function (params ==>(serverRequest,serverResponse,queryString:optional)))
// queryStrings in the callback can be accessed by the queryString object's 'get' key
// the server request object will be available through the 1st parameter of the callback
// the server response object will be available through the 2nd parameter of the callback
var get = async (pathspec, load, callback) => {

    // callToRegiterPath is used to generate path maps, this method get fired only when the generatePathMap
    // route is called
     //extracts the req object from the load
     let req = load.request
     //extracts the res object from the load
     let res = load.response

    callToRegisterPath(pathspec)

    // checks if the HTTP method is GET
    if (req.method == "GET") {
        //creates a parsed url object from the url
        let urlOb = url.parse(req.url)
        //extract the pathname from the parsed url object
        let pathname = urlOb.pathname
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
    }else{
       invalidHttp(res);
    }
}

// delete http method
var del = async (pathspec, load, callback) => {

    // callToRegiterPath is used to generate path maps, this method get fired only when the generatePathMap
    // route is called
    callToRegisterPath(pathspec)
    //extracts the req object from the load
    let req = load.request
    //extracts the res object from the load
    let res = load.response
    // checks if the HTTP method is GET
    if (load.request.method == "DELETE") {
        //creates a parsed url object from the url
        let urlOb = url.parse(req.url)
        //extract the pathname from the parsed url object
        let pathname = urlOb.pathname
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
    }else{
        invalidHttp(res);
    }
}

// Almost similar implementation of the GET method with some additions
var post = (pathspec, load, callback) => {

    callToRegisterPath(pathspec)
    var req = load.request
    var res = load.response
    if (load.request.method === "POST") {
        var urlOb = url.parse(req.url)
        var pathname = urlOb.pathname
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
    }else{
        invalidHttp(res)
    }
}

// combined implementation of the get and post method
var all = (pathspec, load, callback) => {

    callToRegisterPath(pathspec)

    var req = load.request
    var res = load.response
    var urlOb = url.parse(req.url)
    var pathname = urlOb.pathname
    var rawQuery = queryString.parse(urlOb.query)
    // console.log(rawQuery)
    var buffer = ""
    var body

    if (pathname == "/generatePathMap") {
        load.response.end("Path map generated successfully")
    }

    serveStatic(load, pathspec, pathname);


        load.request.on('data', function (data) {
            buffer += data.toString()
        })

        load.request.on("end", async function () {
            body = queryString.parse(buffer)
            rawQuery ? req.query = rawQuery : null
            body ? req.body = body : null
            await callCallBack(pathspec, pathname, callback, req, res)
        })
}

var put = (pathspec, load, callback) => {

    callToRegisterPath(pathspec)
    var req = load.request
    var res = load.response
    if(load.request.method=='PUT'){
        
        var urlOb = url.parse(req.url)
        var pathname = urlOb.pathname
        var rawQuery = queryString.parse(urlOb.query)
        // console.log(rawQuery)
        var buffer = ""
        var body
    
        if (pathname == "/generatePathMap") {
            load.response.end("Path map generated successfully")
        }
    
        serveStatic(load, pathspec, pathname);
    
    
            load.request.on('data', function (data) {
                buffer += data.toString()
            })
    
            load.request.on("end", async function () {
                body = queryString.parse(buffer)
                rawQuery ? req.query = rawQuery : null
                body ? req.body = body : null
                await callCallBack(pathspec, pathname, callback, req, res);
            })
    }else{
        invalidHttp(res)
    }
}

var patch = (pathspec, load, callback) => {

    callToRegisterPath(pathspec)

    if(load.request.method=='PATCH'){
        var req = load.request
        var res = load.response
        var urlOb = url.parse(req.url)
        var pathname = urlOb.pathname
        var rawQuery = queryString.parse(urlOb.query)
        // console.log(rawQuery)
        var buffer = ""
        var body
    
        if (pathname == "/generatePathMap") {
            load.response.end("Path map generated successfully")
        }
    
        serveStatic(load, pathspec, pathname);
    

        load.request.on('data', function (data) {
            buffer += data.toString()
        })

        load.request.on("end", async function () {
            body = queryString.parse(buffer)
            rawQuery ? req.query = rawQuery : null
            body ? req.body = body : null
            await callCallBack(pathspec, pathname, callback, req, res);
        })
    }else{
        invalidHttp(res)
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
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(err));
}

// implementation of the registerPaths method. It takes the pathname send by the callToRegisterPath method
function registerPaths(path) {
    // perform a check if the path map already contains the file, if yes, skips the path, if no, adds it to
    // path map
    if (!registered_path.paths.includes(path)) {
        console.log("Path",path,"generated")
        // the constructPathConfig method to push new path names to the existing path map object
        constructPathConfig(path)
        // creating the path map format to overwrite
        let json = { 'paths': registered_path.paths }
        try {
            // first clears the existing path maps in the paths.map.json file and writes the newly created path
            // maps into the file
            fs.truncate(config.app_root + "/configs/paths.map.json", (err) => {
                if (err)
                    console.log(err)
                fs.writeFile(config.app_root + "/configs/paths.map.json", JSON.stringify(json), () => "written")

            })
        } catch (err) {
            console.log(err)
        }
    }
}

// this function is called by the registerPaths method, use recontruct the path map,
// by pushing new pathname into the existing path object and returning the newly created path object
// ** for now, the return is not used for any purpose
function constructPathConfig(path) {
    registered_path.paths.push(path)
    return registered_path.paths.length
}


//  This function is used to serve static files such as JQuery, Bootstrap files and so on,
// this method takes three parameters, load - contains the request and respone object, 
// pathspec is the path object | string specified when creating the route, and pathname is the
// name of current url 
async function serveStatic(load, pathspec, pathname) {
    if (!pathmap.paths.includes(pathname)) {
        // check if the static to be served is refered by any page, and if the request is of GET type
        if (load.request.headers.referer != undefined && load.request.method == "GET") {
            var read = "";
            var referer = load.request.headers.referer;
            var refererUrlOb = url.parse(referer);
            var refererpath = refererUrlOb.pathname;

            if ((typeof (pathspec) != "object" && refererpath == pathspec) || pathspec.includes(refererpath)) {
                try {
                    read = readFile(path.join(config.template_static, pathname))
                    load.response.end(read);
                }
                catch (err) {
                    console.log(err)
                    load.response.end(err.toString());
                }
            }
        }
    }
}


// Function : render(options : JSON) 
// #parameters : template_directory : optional (if not specified defaults to templates directory inside app root)
//             templateName : String (required)
//             page_title : String
//             page_content : String
//             template_engine : String
//             data : String (when template engine is ejs)
//             res : Object (server response object)
// ** the function is to be replaced by third party templating engine in the future
var render = async (options) => {

    var templateDir = ""

    options.template_directory == "" || options.template_directory == undefined ? templateDir = config.template_directory : templateDir = options.template_directory

    var templatePath = path.join(templateDir, options.templateName)

    if (options.template_engine == undefined) {
        try {
            var loaded = (readFile(templatePath)).toString()
            let content = ""
            if(options.replacable){
                for (const chunks in options.replacable) {
                    let toReplace = `~(${chunks})`
                    content = loaded.replace(toReplace,options.replacable[chunks])
                    loaded = content
                }
            }
            return loaded
        } catch (err) {
            console.log(err)
        }
    } else if (options.template_engine == "ejs" || config.template_engine == "ejs") {
        return await ejsrender(templatePath, options)
    }

}

const ejsrender = async (templatePath, options) => {
    var ejsrenderer = await ejs.renderFile(templatePath, options.data);
    return ejsrenderer;
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
module.exports.route = { 'get': get, 'post': post, 'all': all, 'delete' : del, 'put' : put }
module.exports.render = render
module.exports.redirect = redirect
module.exports.serve = serveStatic
module.exports.error = { "404": err404 }