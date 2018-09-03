
# LaneJs - A REST and ROUTING solution for node
[![npm version](https://badge.fury.io/js/lane-js.svg)](https://badge.fury.io/js/lane-js)

LaneJs is a lightweigh routing solution for [node](https://nodejs.org)

A basic route in LaneJs looks like this : 
```
const { route }= require('lane-js/use/router');
module.export = (req,res) => {
  route(req,res).get('/index',function(err,req,res){
      res.end('Hello World')
  })
}
```

### Installing LaneJs
> before installing LaneJs, you must have node installed in your system.
LaneJs can be installed by using the `npm install` command
```
npm install lane-js --save
```
### Features 
- Fast Routing
- Middleware Support (new in this version)
- Improved Performance 
- Body parsing support
- Param parsing support (new in this version)
- Multipath routes

## A Quick guide to start with LaneJs
To quickly get started with LaneJs, go to  [https://github.com/SamDeka28/demolane](https://github.com/SamDeka28/demolane) and clone the repo.

Once you have cloned the repo, follow the instructions given in the readme.md of the repository

## Directory Structure
To create a LaneJs application, create a directory structure identical to the structure given below
```
yourappname
    --configs
      --config.json
      --paths.map.json
    --urlConfig
      --index.js
    --app.js
```
Once you have created the structure, open the terminal and browse to your app directory
Type in the following commands and follow the instructions: 
```
npm init
```
This will create you package.json file

### Installing the dependencies
To install LaneJs, typein the command in your terminal
```
npm install --save lane-js
```
This will install LaneJs as your project dependency

## Creating the Server
Open your app.js file and paste in the following code to create the LaneJs server : 

```
var config = require("./configs/config.json")

const Server = require("lane-js")

config.app_root = __dirname

const app = Server() //create the server

app.listen(3000, "127.0.0.1", () => console.log("Server is up and running at port 3000"))
```

Open the config.json file (configs/config.json), and add the JSON :
```
{
  app_root = ''
}
```

Open the paths.map.json (configs/paths.map.json) and paste in the following :
```
{
  "paths": []
}
```

Thats all for creating the server

## Routing
Creating a basic route in LaneJs involves requiring the route method from the router module of LaneJs
```
const { route } = require("lane-js/use/router")

module.export = (req,res)=>{
  route( req, res).get( '/', function( err, req, res)=>{
    req.end("Welcome to LaneJs")
  })
}
```
Once the route is created, you need to declare it in the urlConfig. Move to the urlConfig folder and open index.js. Declare the created route as : 
```
const urlConfig = {
  "paths" : [
      "/": require("/path/to/route")
   ]
}

module.exports = urlConfig
```

Once you have declared the route in the urlConfig, start the server `node app.js`. Head to the browser and paste the url [http://localhost:3000/generatePathMap](http://localhost:3000/generatePathMap). This will register the created route in the paths.map.json file.
Once registered, you can use the route that you have created.
> Whenever you create a new route, it is mandatory to declare it in the urlConfig. The route will not be activated until the /generatePathMap is called.

## Registering a Route

By default, `routegeneration` is set to true, i.e you can register a newly created route when you head to the */generatePathMap* route in the browser once the route has been declared in the *urlConfig*. To disable registration of routes, you can pass `routegeneration : false` in the `Server` method. 

```
const app = Server({ routegeneration : false })
```

### Path Params

A basic example of defining path params is shown below:
```
const { route } = require("lane-js/use/router")

module.export = (req,res)=>{
  route( req, res).get( '/user/:id', function( err, req, res)=>{
    req.end("Welcome to LaneJs")
  })
}
``` 
> You need to define the exact path in the urlConfig to make it available for use 

> You can define multiple params in a path. eg : '/user/:id/name/:name'.

### Query Strings

The Query string of a url can be accessed in a route using `req.query`. `req.query` returns an object with key-value pairs.

For example: Suppose a user request an url `'http://localhost:3000/?fname=John&lname=Doe'`. The value of *fname* and *lname* can be accessed as `req.query.fname` and `req.query.lname` respectively.

## Middlewares

Middlewares are functions that manipulates the request and the response object. Middlewares in LaneJs are of two types : 
- **Application level** : Application level middlewares are available throughout the application.
To use a application level middleware, you need to declare in the app.js file when you are creating the server by passing { middlewares : [ middlewarename ]} in the server method.
> the 'middlewares' is an array of middleware function. The middlewares will be executed in the sequence they are defined

```
var app = Server({ middlewares : [] })
```

- **Route level** : Route level middlewares are available for the route where it is declared. To use middlewares in a route, pass a third parameter in the route() function as an object that contains the middlewares array

``` 
route( req, res, { middlewares : [] }).get("/", handler)
```

### Creating your own middleware in LaneJs

Creating a middleware in LaneJs requires passing the *request* and the *response* object to the middleware function and return back the *request* and *response* from that function. A basic sample of a middleware function is shown below : 

``` 
function mymiddleware(req,res){
  req.sayHello = ()=>{
    return "Hello"
  }
  return [req,res]
}
```
Once you have created the middleware, declare it in a route or at an application level. Now, when you console log  `req.sayHello()`, "Hello" will be logged to the console.

## Form handling

LaneJs, by default, can handle `x-www-from-urlencoded` data while using the post method. The data passed is made available in the `req.body` as an object with key-value pair.

## Redirection

To redirect to another path from a handler, we need to import the **redirect** object from the router module as :
```
var { redirect } = require("lane-js/use/router")
```

The syntax for redirection is fairly simple
```
redirect(pathname : String, res : ServerResponse)
```

## Rendering : 

`var { render } = require("lane-js/use/router")`

The render method of LaneJs provide two kind of rendering:
- Inbuilt String interpolated Redering and 
- EJs rendering

To use the Inbuilt String interpolated Redering capabilty for simple render, pass in an object of replacables : 
```
    let content = {
            'page-title':"trajectory.io",
            'page-content':"welcome to the first LaneJs application",
            'application' : 'Lane<span style="color: tomato">Js</span>'
        }

    var renderable = await render({ "templateName": "index.html", replacable : content });
```

And in the html :
```
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
```
> if you are using bootstrap and jquery like in the html snippet given below, you need to download the binaries and provide the relative path of the directory that contains the binaries in the config.js as :
```
{
    "app_root" : "",
    "template_static" : "path/to/directory"
}
```
> Any static asset that needs to be used in the application should be put inside the `static` directory and the path should be registered in the `template_static` key in the config.json file

If you are using the ejs engine, you need to sepecify template_engine : "ejs" in the object passed to the render method:

```
let user = await User.find(); /* fetching the data from the database */
let content = await render({ "templateName": "index.ejs", "template_engine": "ejs", "data": { "data": user }, res: res })
```

```
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
                    <h1>EJS render</h1>
                    <form method="POST" action="/create">
                        <div class="row">
                            <div class="col-md-2">
                                <input type="text" name="name" placeholder="name" class="form-control">
                            </div>
                            <div class="col-md-2">
                                <input type="text" name="username" placeholder="username" class="form-control">
                            </div>
                            <div class="col-md-2">
                                <input type="text" name="email" placeholder="email" class="form-control">
                            </div>
                            <div class="col-md-2">
                                <input type="text" name="password" placeholder="password" class="form-control">
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
```

