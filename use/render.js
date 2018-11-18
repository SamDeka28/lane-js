var serverOption = {}
const fs = require('fs')
const ejs = require("ejs")
const path = require("path")
const pug = require("pug")
const hbs = require("handlebars")
var render = async (res, templateName, contextData) => {
    let templateDir = serverOption.template_directory
    let templatePath = path.join(templateDir, templateName)
    let renderable
    if (serverOption.template_engine == "ejs" || serverOption.template_engine == "ejs") {
        if (contextData) {
            renderable = ejs.renderFile(templatePath, contextData);
        } else {
            renderable = ejs.renderFile(templatePath);
        }
    } else if (serverOption.template_engine == "hbs") {
        let content = fs.readFileSync(templatePath)
        let template = hbs.compile(content.toString());
        renderable = template(contextData);
    } else if (serverOption.template_engine == "pug") {
        renderable = pug.renderFile(templatePath, contextData);
    }
    res.end(await renderable)
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

module.exports.rendererOptions = function (options) {
    serverOption = options
}

function invalidHttp(res) {
    res.writeHead(400)
    err = { status: 400, message: "400 Bad Request" };
    res.end(JSON.stringify(err));
}

// Function Redirect :
// Performs a http redirect
// Requires 2 parameters , the redirection location and the server response object
var redirect = (res, loc) => {
    res.writeHead(302, { Location: loc })
    res.end()
}

// renders a 404 html template
let err404 = async (req, res) => {
    res.writeHead(404)
    let content = await ejsrender(__dirname + "/statics/error/404.html", { name: "Error :::: 404 Page not found" })
    res.end(content)
}
module.exports.redirect = redirect
module.exports.invalidHttp = invalidHttp
module.exports.error = { "404": err404 }
module.exports.render = render
module.exports.ejsrender = ejsrender