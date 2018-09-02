const config = require("../../../configs/config.json")
const path = require("path")
const url = require('url')
const fs = require('fs')
const http = require('http')
const readFile = fs.readFileSync
const pathmap = require("../../../configs/paths.map.json")
//  This function is used to serve static files such as JQuery, Bootstrap files and so on,
// this method takes three parameters, load - contains the request and respone object, 
// pathspec is the path object | string specified when creating the route, and pathname is the
// name of current url 
module.exports = async function serveStatic(load, pathspec, pathname) {
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
