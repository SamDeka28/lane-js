// imports
const { ejsrender } = require("./render")

function invalidHttp(res) {
    res.writeHead(400)
    err = { status: 400, message: "400 Bad Request" };
    res.end(JSON.stringify(err));
}

// Function Redirect :
// Performs a http redirect
// Requires 2 parameters , the redirection location and the server response object
var redirect = (loc, res) => {
    res.writeHead(302, { Location: loc })
    res.end()
}

// renders a 404 html template
let err404 = async (req, res) => {
    res.writeHead(404)
    let content = await ejsrender(__dirname + "/statics/error/404.html", { name: "Error :::: 404 Page not found" })
    res.end(content)
}

//exporting the route, render, redirect, serveStatic method
module.exports.redirect = redirect
module.exports.invalidHttp = invalidHttp
module.exports.error = { "404": err404 }