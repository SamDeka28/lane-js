
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
const { Routify } = require("./routify")
const util = require("./common/defaultMiddlewares")
/**
 * @exports LaneJs
 * @param {object} serverOption 
 * @param {object} serverOption.urls - the urlConfigs
 * @param {object} serverOption.urls.namespace - the namespace if any
 * @param {object} serverOption.urls.paths - the route object
 * @param {Array} serverOption.middlewares - the array of application level middlewares
 * @param {boolean} serverOption.cache_control - set the cache control to true or false
 * @param {string} serverOption.template_directory - the relative path of the template directory
 * @param {string} serverOption.template_static - the relative path of the directory which contains the assets
 * @param {string} serverOption.template_engine - the template engine to be used : hbs | ejs | pug
 * @param {string} serverOption.root_dir - the root directory of the app
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
    let urlConfig = null;
    /**operations on the urlConfig */
    if (typeof serverOption.urls == "object" && Array.isArray(serverOption.urls)) {
        urlConfig = pathify(...serverOption.urls);
    } else {
        urlConfig = serverOption.urls
    }
    let urlRoutes = urlConfig.paths
    let server

    let handler = async (req, res) => {
        var urlOb = url.parse(req.url)
        var pathname = urlOb.pathname
        let reqMethod = req.method;
        let currRoutesInMethod = urlRoutes[reqMethod];
        req.template_directory = serverOption['template_directory'];
        req.template_static = serverOption['template_static'];
        req.root_dir = serverOption['root_dir'];
        try {
            if (!currRoutesInMethod.hasOwnProperty(pathname)) {
                let urlKeys = Object.keys(currRoutesInMethod);
                var pathExtracted = matchPathName(pathname, urlKeys)
                var matchedPath = pathExtracted.pathname
                req.params = pathExtracted.params
            } else {
                matchedPath = pathname;
            }
        } catch (err) {
            console.log(err)
        }
        if (currRoutesInMethod.hasOwnProperty(matchedPath)) {
            let { method, middlewares } = currRoutesInMethod[matchedPath]
            if (req.method == method) {
                let appMiddlewares = [util];
                if (serverOption.hasOwnProperty('middlewares')) {
                    appMiddlewares.push(...serverOption['middlewares']);
                }
                if (middlewares) {
                    appMiddlewares.push(...middlewares);
                }
                if (appMiddlewares.length) {
                    await middleware({ middlewares: appMiddlewares }, req, res);
                }
            } else {
                return invalidHttp(res)
            }
            let rawQuery = queryString.parse(urlOb.query);
            req.query = rawQuery ? rawQuery : {};
            try {
                return currRoutesInMethod[matchedPath].handler(req, res)
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

module.exports = { Server: LaneJs, render: render, redirect: redirect, pathify: pathify, Routify: Routify }