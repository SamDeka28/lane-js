
/*
*
*   An Lightweight framework for Node
*   Codebase focuses on Routing and rendering html, middlewares, pathgeneration and management,
*   and Serving statics
*   Author : Samudra Deka
*
*/

const http = require('http')
const url = require("url")
const queryString = require('querystring')
const er404 = require("./router").error['404']
const serve = require("./serveStatics")
const middleware = require("./middleware")
const { rendererOptions, render, redirect } = require("./render")
const matchPathName = require("./common/matchPath")
const https = require("https")
const http2 = require("http2")
//Creating the server
var LaneJs = function (serverOption) {
    try {
        rendererOptions(serverOption)
    } catch (err) { console.log(err) }

    // declare the server
    let server
    let handler = async (req, res) => {

        //transform request object using middleware
        [req, res] = middleware(serverOption, req, res)
        // Get the url Object by parsing the url using node's url module parse method
        var urlOb = url.parse(req.url)
        // extract the pathname from the url Object
        var pathname = urlOb.pathname
        // the urls from the urlConfig
        try {
            var urlConfig = serverOption.urls
        } catch (err) {
            console.log(err)
        }

        let urlKeys = Object.keys(urlConfig.paths)
        try {
            if (!urlKeys.includes(pathname)) {
                var pathExtracted = matchPathName(pathname, urlKeys)
                var matchedPath = pathExtracted.pathname
                req.params = pathExtracted.params
            } else {
                matchedPath = pathname
            }
        } catch (err) {
            console.log(err)
        }
        // Performs a check to see if the pathname of the url matches with the registered path 
        if (urlKeys.includes(matchedPath)) {
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

                let { method } = urlConfig.paths[matchedPath]
                let middlewares = urlConfig.paths[matchedPath].middlewares || []
                try {
                    if (req.method == method) {
                        [req, res] = middleware({ middlewares: middlewares }, req, res)
                        await urlConfig.paths[matchedPath].handler(req, res)
                    } else {
                        er404(req, res)
                    }
                } catch (err) {
                    console.log(err)
                }
            })
            return
        } else {
            // if the pathname is not registered, the application treats the url as a static or a foreigner
            if (req.headers.referer != undefined && req.method == "GET" && matchedPath != "/favicon.ico") {
                return await serve({ request: req, response: res, serverOption: serverOption }, req.headers.referer, matchedPath)
            }
        }
        // If the application is unable to find the url then it return a 404 ERROR 
        er404(req, res)
    }

    // create server with http or https if defined
    if (serverOption && (serverOption.hasOwnProperty('https') || serverOption.hasOwnProperty('http2'))) {
        let { key, cert } = serverOption['https'] || serverOption['http2']
        if (serverOption.hasOwnProperty('https')) {
            server = https.createServer({ key: key, cert: cert }, handler)
            return server
        }
        if (serverOption.hasOwnProperty('http2')) {
            server = http2.createSecureServer({ key: key, cert: cert }, handler)
            return server
        }
    }
    server = http.createServer(handler)
    // finally the server is returned
    return server
}

// exposing the LaneJs function that the user can use to create a server by simply requiring the LaneJs module
// and calling the LaneJs method
module.exports = { Server: LaneJs, render: render, redirect: redirect }