// imports
const url = require('url')
const queryString = require('querystring')
const middleware = require("./middleware")
const serveStatic = require("./serveStatics")
const { render, ejsrender } = require("./render")
const matchPathname = require("./common/matchPath")
const paramParser = require("./common/paramParser")
const urlConfig = { paths: [] }
const appOptions = {}
// Function Signature: route(path : String/Array, httpload : JSON {request,response}, 
// callback : Function (params ==>(serverRequest,serverResponse,queryString:optional)))
// queryStrings in the callback can be accessed by the queryString object's 'get' key
// the server request object will be available through the 1st parameter of the callback
// the server response object will be available through the 2nd parameter of the callback
function route(request, response, options) {
    let serverOption = {}
    //modify the req and res if middleware exists
    if (typeof options == "object" || options != undefined) {
        Object.assign(serverOption, options)
    }
    serverOption.urls = urlConfig

    let { req, res } = middleware(serverOption, request, response)
    let load = { request: req, response: res, serverOption: Object.assign(serverOption, appOptions) }
    //creates a parsed url object from the url
    let urlOb = url.parse(req.url)
    //extract the pathname from the parsed url object
    let path = urlOb.pathname

    return {
        // this is GET Http method function expression. All the Http method function expression takes
        // three arguments, the pathspec is the pathname(string | Array) specified when creating the route,
        // the load has the req and res object passed from the route which can be accessed as load.req or load.res,
        // and the callback handler for the route
        //
        get: async (pathspec, callback) => {
            // checks if the HTTP method is GET
            if (req.method == "GET") {
                methodHandler(pathspec, callback);
            } else {
                invalidHttp(res);
            }
        },
        delete: async (pathspec, callback) => {
            if (req.method == "DELETE") {
                methodHandler(pathspec, callback);
            } else {
                invalidHttp(res);
            }
        },
        post: async (pathspec, callback) => {
            if (req.method === "POST") {
                methodHandler(pathspec, callback);
            } else {
                invalidHttp(res)
            }
        },
        all: async (pathspec, callback) => {
            methodHandler(pathspec, callback);
        },
        put: async (pathspec, callback) => {
            if (load.request.method == 'PUT') {
                methodHandler(pathspec, callback);
            } else {
                invalidHttp(res)
            }
        },
        patch: (pathspec, callback) => {

            if (req.method == 'PATCH') {
                methodHandler(pathspec, callback);
            } else {
                invalidHttp(res)
            }
        }
    }

    function methodHandler(pathspec, callback) {
        req.params = paramParser(path, pathspec);
        var pathname;
        //checks for matched path
        ({ pathname, pathspec } = checkPath(pathspec));
        var rawQuery = queryString.parse(urlOb.query);
        // declared an empty buffer
        var buffer = "";
        var body = {};
        // utilizing the on data event for creating the data from the posted data buffer
        req.on('data', function (data) {
            buffer += data.toString();
        });
        req.on("end", async function () {
            // on successfull extraction of the post data, the body is parsed and stored in the body object
            body = queryString.parse(buffer);
            req.query = rawQuery ? rawQuery : {};
            req.body = body ? body : {};

            try {
                // the call back has three arguments, the req and res object and a object that contains
                // the parsed query string object the is exposed throught the get key
                await callback(null, req, res);
            }
            catch (err) {
                try {
                    await callback(err, req, res);
                } catch (err) {
                    console.log(err)
                }
            }
        });
    }

    function checkPath(pathspec) {
        if (!urlConfig.paths.includes(path)) {
            try {
                pathspec = typeof pathspec == 'object' ? pathspec : [pathspec];
                var pathname = matchPathname(path, pathspec);
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            pathname = path;
        }
        return { pathname, pathspec };
    }
}

function invalidHttp(res) {
    res.writeHead(400)
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
    res.writeHead(404)
    let content = await ejsrender(__dirname + "/statics/error/404.html", { req: req, res: res, data: { name: "Error :::: 404 Page not found" } })
    res.end(content)
}

function setServerOption(option) {
    Object.assign(appOptions, option)
}

var setUrlConfigs = (configs) => {
    urlConfig.paths = configs
}
//exporting the route, render, redirect, serveStatic method
module.exports.render = render
module.exports.setUrlConfigs = setUrlConfigs
module.exports.setServerOption = setServerOption
module.exports.redirect = redirect
module.exports.serve = serveStatic
module.exports.error = { "404": err404 }
module.exports.route = route