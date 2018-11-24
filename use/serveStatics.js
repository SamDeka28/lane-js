const path = require("path")
const fs = require('fs')
const readFile = fs.readFileSync
/**
 * 
 * @param {Object} load 
 * @param {*} pathname 
 */
function serveStatic(load, pathname) {
    var read = "";
    read = readFile(path.join(load.serverOption.template_static, pathname))
    load.response.end(read);
}
module.exports = serveStatic 
