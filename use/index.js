
/*
*
*   An Lightweight framework for Node
*   Codebase focuses on Routing and rendering html, middlewares, pathgeneration and management,
*   and Serving statics
*   Author : Samudra Deka
*
*/

const http = require('http')
const urlConfig = require("../../../urlConfig")
const url = require("url")
const er404 = require("./router").error['404']
const serveStatic = require("./router")
const pathmap = require("../../../configs/paths.map.json")
const middleware = require("./middleware")
const routeGen = require("./routegenerate")
const matchPathName = require("./common/matchPath")
//Creating the server
var LaneJs = function (serverOption) {

    const server = http.createServer(async (request, response) => {

        //transform request object using middleware
        let { req, res } = middleware(serverOption, request, response)
        // Get the url Object by parsing the url using node's url module parse method
        var urlOb = url.parse(req.url)
        // extract the pathname from the url Object
        var pathname = urlOb.pathname

        // disable or enable route generation 
        if (serverOption && serverOption.routegeneration != undefined) {
            routeGen.routegeneration = !serverOption.routegeneration ? false : true
        } else {
            routeGen.routegeneration = true
        }

        // the code snippet below is used to generate the path map i.e the route path in a JSON file 
        //'paths.map.json' . This file is used to keep a track of the routes that has been created 
        // when the generatePathMap route is hitted, it goes throught all the routes and registers it
        if (pathname == "/generatePathMap") {
            var pathsKeys = Object.keys(urlConfig.paths)
            try {
                pathsKeys.forEach(pathkey => {
                    urlConfig.paths[pathkey](req, res)
                })
            } catch (err) {
                console.error(err)
                res.end(err)
            }
        }
        if (!pathmap.paths.includes(pathname)) {
            var matchedPath = matchPathName(pathname, pathmap.paths)
        } else {
            matchedPath = pathname
        }
        // Performs a check to see if the pathname of the url matches with the registered path 
        if (pathmap.paths.includes(matchedPath)) {
            try {
                return await urlConfig.paths[matchedPath](req, res)
            } catch (err) {
                console.log(err)
            }
        } else {
            // if the pathname is not registered, the application treats the url as a static or a foreigner
            if (req.headers.referer != undefined && req.method == "GET" && matchedPath != "/favicon.ico") {
                return await serveStatic.serve({ request: req, response: res }, req.headers.referer, matchedPath)
            }
        }
        // If the application is unable to find the url then it return a 404 ERROR 
        er404(req, res)
    })
    // finally the server is returned
    return server
}

// exposing the LaneJs function that the user can use to create a server by simply requiring the LaneJs module
// and calling the LaneJs method
module.exports = LaneJs