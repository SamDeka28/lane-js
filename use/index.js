
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
const er404 = require("./router").error['404']
const { serve, setUrlConfigs, setServerOption } = require("./router")
const middleware = require("./middleware")
const { rendererOptions } = require("./render")
const matchPathName = require("./common/matchPath")
//Creating the server
var LaneJs = function (serverOption) {
    try {
        //set urlConfig to be accesible by the router
        setUrlConfigs(Object.keys(serverOption.urls.paths))
        //set serverOption to be accessible by the render method
        rendererOptions(serverOption)
        // set Server Options For Router
        setServerOption(serverOption)
    } catch (err) { console.log(err) }

    const server = http.createServer(async (request, response) => {

        //transform request object using middleware
        let { req, res } = middleware(serverOption, request, response)
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

        if (!urlKeys.includes(pathname)) {
            var matchedPath = matchPathName(pathname, urlKeys)
        } else {
            matchedPath = pathname
        }
        // Performs a check to see if the pathname of the url matches with the registered path 
        if (urlKeys.includes(matchedPath)) {
            try {
                return await urlConfig.paths[matchedPath](req, res)
            } catch (err) {
                console.log(err)
            }
        } else {
            // if the pathname is not registered, the application treats the url as a static or a foreigner
            if (req.headers.referer != undefined && req.method == "GET" && matchedPath != "/favicon.ico") {
                return await serve({ request: req, response: res, serverOption: serverOption }, req.headers.referer, matchedPath)
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