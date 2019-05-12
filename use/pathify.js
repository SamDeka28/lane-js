/**
 * @module pathify
 * @param args - the urlConfigs
 * @return {object} paths
 */
module.exports.pathify = function (...args) {
    let urls = {}
    for (const key in arguments) {
        if (arguments[key].hasOwnProperty('namespace')) {
            let namespace = arguments[key]['namespace']
            delete arguments[key]['namespace']
            urls = { ...reconstructUrl(arguments, key, urls, namespace) };
        } else {
            urls = { ...reconstructUrl(arguments, key, urls) }
        }
    }
    return { paths: urls }
}

function reconstructUrl(arguments, key, urls, namespace) {
    let pathMethods = arguments[key].paths;
    for (const method in pathMethods) {
        !urls.hasOwnProperty(method) ? urls[method] = {} : null
        let paths = pathMethods[method];
        for (const path in paths) {
            let pathProperties = paths[path];
            if (namespace) {
                urls[method][`/${namespace}${path}`] = pathProperties;
            } else {
                urls[method][path] = pathProperties
            }
        }
    }
    return urls
}