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
    let { response, request, serverOption: { cache_control } } = load
    let filePath = path.join(load.serverOption.template_static, pathname)
    let stats = fs.statSync(filePath)
    let mtimems = stats.mtimeMs
    if ((cache_control == undefined || cache_control == true) || cache_control != false) {
        if (request.headers.hasOwnProperty('if-none-match')) {
            if (request.headers['if-none-match'] == `"${mtimems}"`) {
                response.writeHead(304)
                return response.end()
            }
        }
    }
    response.setHeader('ETag', `"${mtimems}"`)
    read = readFile(filePath)
    response.end(read);

}
module.exports = serveStatic 
