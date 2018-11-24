var serverOption = {}
const fs = require('fs')
const ejs = require("ejs")
const path = require("path")
const pug = require("pug")
const hbs = require("handlebars")
/**
 * 
 * @param {object} res - the server response object
 * @param {string} templateName - the name of the template
 * @param {object} contextData - the renderable data
 * 
 */
const render = async (res, templateName, contextData) => {
    let templateDir = serverOption.template_directory
    let templatePath = path.join(templateDir, templateName)
    let renderable
    if (serverOption.template_engine == "ejs" || serverOption.template_engine == "ejs") {
        if (contextData) {
            renderable = await ejs.renderFile(templatePath, contextData);
        } else {
            renderable = await ejs.renderFile(templatePath);
        }
    } else if (serverOption.template_engine == "hbs") {
        let content = fs.readFileSync(templatePath)
        let template = hbs.compile(content.toString());
        renderable = template(contextData);
    } else if (serverOption.template_engine == "pug") {
        renderable = pug.renderFile(templatePath, contextData);
    }
    res.end(renderable)
}

const ejsrender = (templatePath, contextData) => {
    let renderable
    if (contextData) {
        renderable = ejs.renderFile(templatePath, contextData);
    } else {
        renderable = ejs.renderFile(templatePath);
    }
    return renderable
}
/**
 * used to set the server options for the render module
 */
module.exports.rendererOptions = function (options) {
    serverOption = options
}

/**
 * invalid http request
 * @param {*} res 
 * @returns 404
 */
function invalidHttp(res) {
    res.writeHead(400)
    err = { status: 400, message: "400 Bad Request" };
    res.end(JSON.stringify(err));
}

/**
 * @param {*} res - the ServerResponse object
 * @param {*} loc - the redirect uri
 */
const redirect = (res, loc) => {
    res.writeHead(302, { Location: loc })
    res.end()
}

/**
 * renders a 404 html template
 * @param {*} req 
 * @param {*} res 
 */
const err404 = async (req, res) => {
    res.writeHead(404)
    let content = await ejsrender(__dirname + "/statics/error/404.html", { name: "Error :::: 404 Page not found" })
    res.end(content)
}
module.exports.redirect = redirect
module.exports.invalidHttp = invalidHttp
module.exports.error = { "404": err404 }
module.exports.render = render
module.exports.ejsrender = ejsrender