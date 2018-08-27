
/*
*
*   An application for understating Raw node
*   Code focuses on Routing and rendering html
*   and Serving statics
*   Authored by Samudra Deka
*
*/

const http = require('http')
const urlConfig = require("../../../urlConfig")
const url = require("url")
const er404 = require("./router").error['404']
const serveStatic = require("./router")
const pathmap = require("../../../configs/paths.map.json")

//Creating the server
var LaneJs = function () {
  
    const server = http.createServer(async (req, res) => {

        // Get the url Object by parsing the url using node's url module parse method
        var urlOb = url.parse(req.url)
        // extract the pathname from the url Object
        var pathname = urlOb.pathname
        // the code snippet below is used to generate the path map i.e the route path in a JSON file 
        //'paths.map.json' . This file is used to keep a track of the routes that has been created 
        // when this generatePathMap route is hitted, it goes throught all the routes and registers it
        if (pathname == "/generatePathMap") {
            var pathsKeys = Object.keys(urlConfig.paths)
            pathsKeys.forEach(pathkey => {
                urlConfig.paths[pathkey](req, res)
            })
        }

        // Performs a check to see if the pathname of the url matches with the registered path 
        if (pathmap.paths.includes(pathname)) {
            try {
                return await urlConfig.paths[pathname](req, res)
            } catch (err) {
                console.log(err)
            }
        } else {
            // if the pathname is not registered, the application treats the url as a static or a foreigner
            if (req.headers.referer != undefined && req.method == "GET" && pathname!="/favicon.ico") {
                return await serveStatic.serve({ request: req, response: res }, req.headers.referer, pathname)
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
