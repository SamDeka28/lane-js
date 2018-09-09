module.exports.pathify = function(...args) {
    let urls = {}
    for (const key in arguments) {
        urls = Object.assign(urls, arguments[key].paths);
    }
    return { paths: urls }
}