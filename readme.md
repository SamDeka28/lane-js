
# LaneJs - A REST and ROUTING solution for node
[![npm version](https://badge.fury.io/js/lane-js.svg)](https://badge.fury.io/js/lane-js)  [![Known Vulnerabilities](https://snyk.io/test/github/SamDeka28/lane-js/badge.svg)](https://snyk.io/test/github/SamDeka28/lane-js)

LaneJs is a lightweight routing solution for [Node.Js](https://nodejs.org)

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
- Middleware Support
- Improved Performance 
- Body parsing support
- Param parsing support
- Multipath routes

### CHANGELOGS
- Added namespaces in urlConfigs
- Added `pathify` for modular dependency of urlConfigs
- Removed Route generation
- Removed dependency of configs/config.json and configs/paths.map.json

> From this version, /generatePathMap has been disabled. There is no need of registering a route. A route is automatically registered and made available for use once it is defined in the urlConfig

## A Quick guide to start with LaneJs
To quickly get started with LaneJs, go to  [https://github.com/SamDeka28/lanify](https://github.com/SamDeka28/lanify) and clone the repo.

Once you have cloned the repo, follow the instructions given in the readme.md of the repository

## Directory Structure
To create a LaneJs application, create a directory structure identical to the structure given below
```
yourappname
    --urlConfig
      --index.js
    --views
    --app.js
```
> It is not mandatory to create the same directory structure. You can structure your application the way you want. The only neccessary file here is the app.js (you can name it whatever you like) for initializing the server

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
const Server = require("lane-js")
const { route } = require("lane-js/use/router")

const urlConfig = {
    "paths": {
        "/" : (req,res)=>{
            route(req,res).get("/",(err,req,res)=>{
                res.end("Welcome to LaneJs")
            })
        }
    }
}

const app = Server({ urls : urlConfig })

app.listen(3000, "127.0.0.1", () => console.log("Server is up and running at port 3000"))
```

Thats all for creating the server

## Server Options
- **middlewares** : middlewares takes in an array of middleware function that can transform the request and the response object before it reaches the route handler.
```
const app = Server({ middlewares : [
    function lane(req, res) {
        console.log("hello")
        return [req, res]
    }
] })
```

- **urls** : this take a urlConfig object, that contains a `paths` key which is an object of routes defined for the application
```
let urlConfig = {
    "paths": {
        "/": require("path/to/route"),
    }
}
const app = Server({ urls : urlConfig })
```
- **template_directory** : the relative path for the directory that contains your static html or ejs files
```
const app = Server({ template_directory: "views" })
```
- **template_static** : the relative path for the directory that contains you static assets such as boostrap files, jquery files, images etc
```
const app = Server({ template_static: "views/static" })
```
- **template_engine** : the template engine that you are using, LaneJs supports ejs for rendering views.
```
const app = Server({ template_engine: "ejs" })
```

## UrlConfig
The urlConfig is an object where we define the `pathnames` for the routes we create in our application. This object should be passed in the `urls` key in the serverOptions object.  It has two keys :

- `paths` : this object contains key-value pair for our routes; the `key` being the pathname and the `value` being the route function that we create. For example.
```
const urlConfig = {
  "paths" : {
      "/": require("/path/to/route")
  }
}
```
- `namespace`: The `namespace` is a key that when defined, prepends to each `pathname` defined in the `paths` object of the urlConfig. This option can only be used with `pathify`. A simple example of using urlConfig using namespace is given below:

`urlConfig`
```
let { route } = require("lane-js/use/router")

let urlConfig = {
  'namespace': "users",
  'paths': {
    "/index": (req, res) => {
      route(req, res).get("/index", (err, req, res) => {
        res.end("Welcome to LaneJs")
      })
    }
  }
}

module.exports = urlConfig
```

In `app.js` : 

```
const Lane = require("lane-js")
const { pathify } = require("lane-js/use/pathify")

let urls = pathify(require("./urlConfig"))

const serverOptions = {
  urls: urls,
  template_directory: "views",
  template_static: "views",
  template_engine: "ejs"
}

let app = Lane(serverOptions)

app.listen(3000, () => console.log('Server is up and running at 3000'))
```
Now you can access `/index` route that you have created from http://localhost:3000/users/index

## Pathify :

`Pathify` is module that is used to combine `urlConfigs` of different modules in your application into one single urlConfig that can be passed to the `urls` option in the serverOptions

For example :
```
const Lane = require("lane-js")
const { pathify } = require("lane-js/use/pathify")

let user = {
    namespace : 'user',
    paths : {
        "/create" : require(path/to/route)
    }
}

let login = {
    paths : {
        "/login" : require(path/to/route)
    }
}

let urls = pathify(login,user)

const serverOptions = {
  urls: urls,
  template_directory: "views",
  template_static: "views",
  template_engine: "ejs"
}

let app = Lane(serverOptions)

app.listen(3000, () => console.log('Server is up and running at 3000'))
```


## Routing

Creating a basic route in LaneJs involves requiring the `route` method from the router module of LaneJs
```
const { route } = require("lane-js/use/router")

module.export = (req,res)=>{
  route( req, res).get( '/', function( err, req, res)=>{
    req.end("Welcome to LaneJs")
  })
}
```
Once the route is created, you need to declare it in the *urlConfig*. Move to the urlConfig folder and open index.js. Declare the created route as : 
```
const urlConfig = {
  "paths" : {
      "/": require("/path/to/route")
  }
}

module.exports = urlConfig
```

Once you have declared the route in the urlConfig, start the server `node app.js`. You can now use the route that you have created.

> Ensure that you have required the urlConfig in the app.js file and passed it to the server method as : `const app = Server({ urls : urlConfig })`

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

The params can be accessed in a route using `req.params`

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

For a middleware with options :

``` 
function mymiddleware(option){
  return (req,res)=>{
    console.log(option)
    return [req,res]
  }
}
```

> Any express module can be used with lane-js with slight modifications to the modules by replacing all the `next()` function with `return [req,res]` and removing the `next` argument from any function that might be passing it

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
Example : 
```
redirect("https://www.google.com",res)
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
> if you are using bootstrap and jquery like in the html snippet given below, you need to download the binaries and provide the relative path of the directory that contains the binaries and pass it to the server :
```
const app = Server({ "template_static" : "path/to/directory" })
```
> Any static asset that needs to be used in the application should be put inside the `static` directory and the path should be registered in the `template_static` key and should be passed to the server method

If you are going to use the ejs engine, you need to sepecify template_engine : "ejs" in the object passed to the render method or to the serverOptions:

```
let title ="Welcome to laneJs"
let content = await render({ "templateName": "index.ejs", "template_engine": "ejs", "data": { "title": title }})
res.end(content)
```

```
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title><%=title%></title>
    </head>

    <body>
        <h1><%=title%></h1>
    </body>

    </html>
```

### LICENSE 
Licensed under **MIT**
