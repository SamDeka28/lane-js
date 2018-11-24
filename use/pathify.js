/**
 * @param args - the urlConfigs
 * @return {object} paths
 */
module.exports.pathify = function (...args) {
    let urls = {}
    for (const key in arguments) {
        if (arguments[key].hasOwnProperty('namespace')) {
            let namespace = arguments[key]['namespace']
            delete arguments[key]['namespace']
            let pathKeys = Object.keys(arguments[key].paths)
            pathKeys.forEach(path => {
                arguments[key].paths[`/${namespace}${path}`] = arguments[key].paths[path]
                delete arguments[key].paths[path]
            });
        }
        urls = Object.assign(urls, arguments[key].paths);
    }
    return { paths: urls }
}