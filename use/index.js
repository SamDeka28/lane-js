
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
const er404 = require("./render").error['404']
const serve = require("./serveStatics")
const middleware = require("./middleware")
const { rendererOptions, render, redirect, invalidHttp } = require("./render")
const matchPathName = require("./common/matchPath")
const { pathify } = require("./pathify")

/**
 * 
 * @param {object} serverOption 
 * @param {object} serverOption.urls - the urlConfigs
 * @param {object} serverOption.urls.namespace - the namespace if any
 * @param {object} serverOption.urls.paths - the route object
 * @param {Array} serverOption.middlewares - the array of application level middlewares
 * @param {boolean} serverOption.cache_control - set the cache control to true or false
 * @param {string} serverOption.template_directory - the relative path of the template directory
 * @param {string} serverOption.template_static - the relative path of the directory which contains the assets
 * @param {string} serverOption.template_engine - the template engine to be used : hbs | ejs | pug
 * @param {object} serverOption.https - the secure server options if any
 * @param {string} serverOption.https.key - the private ssl key
 * @param {string} serverOption.https.cert - the ssl certificate
 * @param {object} serverOption.http2 - the secure server options if any
 * @param {string} serverOption.http2.key - the private ssl key
 * @param {string} serverOption.http2.cert - the ssl certificate
 * @returns the app instance
 *  
 */
var LaneJs = function (serverOption) {
    try {
        rendererOptions(serverOption)
    } catch (err) { console.log(err) }

    let server
    let handler = async (req, res) => {
        var urlOb = url.parse(req.url)
        var pathname = urlOb.pathname
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
        if (urlKeys.includes(matchedPath)) {
            let { method, middlewares } = urlConfig.paths[matchedPath]
            if (req.method == method) {
                try {
                    middlewares = middlewares ? serverOption.middlewares.concat(middlewares) : serverOption.middlewares
                    await middleware({ middlewares: middlewares }, req, res, (request, response) => {
                        req = request
                        res = response
                    })
                } catch (err) {
                    console.log(err)
                }
            } else {
                return invalidHttp(res)
            }
            let rawQuery = queryString.parse(urlOb.query);
            req.query = rawQuery ? rawQuery : {};
            try {
                return urlConfig.paths[matchedPath].handler(req, res)
            } catch (err) {
                console.log(err)
            }
            return
        } else {
            if (req.method == "GET") {
                try {
                    return serve({ request: req, response: res, serverOption: serverOption }, matchedPath)
                } catch (err) {
                    return er404(req, res)
                }
            }
        }
        er404(req, res)
    }

    // create server with http | https | http2 if defined
    if (serverOption && (serverOption.hasOwnProperty('https') || serverOption.hasOwnProperty('http2'))) {
        if (serverOption.hasOwnProperty('https')) {
            const https = require("https")
            server = https.createServer(serverOption['https'], handler)
            return server
        }
        if (serverOption.hasOwnProperty('http2')) {
            const http2 = require("http2")
            server = http2.createSecureServer(serverOption['http2'], handler)
            return server
        }
    }
    server = http.createServer(handler)
    return server
}

module.exports = { Server: LaneJs, render: render, redirect: redirect, pathify: pathify }