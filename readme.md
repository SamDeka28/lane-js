LaneJs - A REST API solution for node
====================================
LaneJs is a light weight routing solution for creating REST API's.
It's design is inspired by node's popular framework -ExpressJs, and the routing
is Django inspired. It has a simplified and a small core that handles all the routing.
This framework doesn't bend you to the rules. Using the node's core API is recommended.
In today's world, nodeJs has been evolving ever since it's inception. Though due to the
heavy dependency of the developer upon frameworks, use of nodeJs strong core API is somewhere
lost. We, at Lane, welcomes you to use the Node's core API, although you do not have to write
you routing solution yourself. The main objective of Lane is to provide you the routing solution
you need. 

LaneJs, itself is developed using only the Node's core API.

How to use Lane 
================
Lane routing is inspired by the python's DJANGO framework. Therefore, we define the routes in the
urlConfig.

A Basic example of the url config
=================================

<code>
    let { index, home, create, del } = require("../lanes/index")

    var urlConfig = {
        "paths": {
            "/index": index,
            "/": index,
        }
    }
</code>

The urlConfig is an Object that contain "paths" child, where we can define the routes. The urlConfig resides
in the app root inside the urlConfig directory.

Creating the Lane Server
========================
The Lane server can be created just in a snap by using a simple code snippet and configuration

<code>
    const config = require("./configs/config.json");
    const Scratch = require("lane-js");

    config.app_root = __dirname; /* required */
    
    const app = Scratch();

    app.listen(3001, "127.0.0.1", () => console.log("Server is up and running at port 3001"))
</code>

The configs
===============
The configs directory consists of the mandatory file.

1. `config.json`: config.json is a requied file for LaneJs which resides in the application root inside the configs directory. The snippet below shows the required keys for the config.json file
<code>
    {
        "template_directory": "views",
        "app_root" : "",
        "template_static" : "views/static",
        "template_engine" : "ejs" /* required only if you are using ejs */
    }
</code>
the ejs template engine is just a side support in Lane because LaneJs's main objective is to provide routing for REST API's

2. `paths.map.json` :  the paths.map.json is a required file in LaneJs. This file contains a JSON containing only a single key 'paths' of type array. This file is used by Lane to keep track of the routes that has been created. the file automatically get rewritten when calling the "/generatePathMap" is called from the url. Once you create a route and define it in the urlConfig, hit the /generatePathMap so that the newly created route is now usable. 



Router in Lane
===============
Creating Routes in Lane is pretty simple, It somewhere resembles the Express kind of routing.
To create a Route in Lane, import the router module as :

var { route } = require("lane-js/use/router")

Now, you can create the route by using the "route" object as : 

<code>
    var { route } = require("lane-js/use/router")
    var { indexhandler } = require("../models/index")

    module.exports.index = (req, res) => {
        route.get(['/', '/index'], { request: req, response: res }, indexhandler)
    }
</code>

As you can see, the route is of type GET http method. It takes in a path as a string or an 
array of path string.. In the above example ['/', '/index'] will route you to the same route handler.

Breaking the route syntax in Lane
=================================
The syntax for route in Lane is :

routeObject.<httpVerb>(path : String | Array, { request : requestObject , response : response object} , routehandler)

Creating the route handler
==========================
The route handler in Lane is pretty simple as it uses the Node's native API. 
A basic example of a route handler is shown below:

<code>
    var handler = async (err, req, res) => {
        var renderable = "Welcome to you first Lane application";
        res.write(renderable);
        res.end();
    }
    module.exports = { indexhandler: handler }
</code>

The handler takes in three params : (error, request, response)
1. `error` - Any error encountered by the route
2. `request` - Server request object.The querystring object and the payload are exposed through request.query and request.payload
3. `response` - Server response object. 

Redirection in Lane
===================
To redirect a to another path from a handler, we fist need to import the redirect object from the router module as :
var { redirect } = require("lane-js/use/router")

The syntax for redirection is fairly simple
redirect(pathname : String, res : ServerResponse)

Render a Html in Lane : 
======================
var { render } = require("lane-js/use/router")

The render object of LaneJs provide two kind of rendering:
Inbuilt String interpolated Redering and EJs rendering
To use the Inbult String interpolated Redering capabilty for simple render:
<code>
    let content = {
            'page-title':"trajectory.io",
            'page-content':"welcome to the first trajectory application",
            'application' : 'Lane<span style="color: tomato">Js</span>'
        }

    var renderable = await render({ "templateName": "index.html", replacable : content });
</code>

And in the html :
<snippet>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="/bootstrap/bootstrap-3.3.7-dist/css/bootstrap.min.css">
        <script type="application/javascript" src="/bootstrap/bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>
        <script type="application/javascript" src="/js/jquery/jquery-2.2.1.js"></script>
        <title>~(page-title)</title>
        <style>
            .holder-vh-100{
                height: 90vh;
                width: 100vw;
                display: flex;
            }
            .flex-center{
                margin: auto;
            }
        </style>
    </head>
    <body>
        <div class="container-fluid">
            
            <div class="holder-vh-100">
                    <div class="flex-center text-center">
                            <h1>~(application)</h1>
                            <h3><p class="btn-lg btn-success">~(page-content)</p></h3>
                    </div> 
            </div>
        </div>
    </body>
    </html>
</snippet>


If you are using the ejs engine, you need to sepecify template_engine : "ejs" in the object passed to the render method:

<code>
let user = await User.find(); /* fetching the data from the database */
let content = await render({ "templateName": "index.ejs", "template_engine": "ejs", "data": { "data": user }, res: res })
</code>

<snippet>
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="/bootstrap/bootstrap-3.3.7-dist/css/bootstrap.min.css">
        <script type="application/javascript" src="/bootstrap/bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>
        <script type="application/javascript" src="/js/jquery/jquery-2.2.1.js"></script>
        <title>Document</title>
    </head>

    <body>
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <h1>CRUD IN SCRATCH.IO</h1>
                    <form method="POST" action="/create">
                        <div class="row">
                            <div class="col-md-2">
                                <input type="text" name="name" pLaneholder="name" class="form-control">
                            </div>
                            <div class="col-md-2">
                                <input type="text" name="username" pLaneholder="username" class="form-control">
                            </div>
                            <div class="col-md-2">
                                <input type="text" name="email" pLaneholder="email" class="form-control">
                            </div>
                            <div class="col-md-2">
                                <input type="text" name="password" pLaneholder="password" class="form-control">
                            </div>
                            <div class="col-md-2">
                                <input type="submit" value="add" class="btn btn-primary">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-md-12">
                    <table class="table table-striped">
                        <tr>
                            <th>name</th>
                            <th>username</th>
                            <th>email</th>
                            <th>password</th>
                            <th>action</th>
                        </tr>
                        <% data.forEach(function(user){%>
                            <tr>
                                <td>
                                    <%= user.name %>
                                </td>
                                <td>
                                    <%= user.username %>
                                </td>
                                <td>
                                    <%= user.email %>
                                </td>
                                <td>
                                    <%= user.password %>
                                </td>
                                <td>
                                    <a href=/delete?id=<%= user._id %>>delete</a>
                                </td>
                            </tr>
                            <% }) %>
                    </table>
                </div>
            </div>
        </div>

    </body>

    </html>
</snippet>
