
# LaneJs - A REST and ROUTING solution for node
[![npm version](https://badge.fury.io/js/lane-js.svg)](https://www.npmjs.com/package/lane-js)  [![Known Vulnerabilities](https://snyk.io/test/github/SamDeka28/lane-js/badge.svg)](https://snyk.io/test/github/SamDeka28/lane-js)  [![npm](https://img.shields.io/npm/dt/lane-js.svg)](https://www.npmjs.com/package/lane-js) [![NpmLicense](https://img.shields.io/npm/l/lane-js.svg?registry_uri=https%3A%2F%2Fregistry.npmjs.com)](https://www.npmjs.com/package/lane-js)

LaneJs is a lightweight routing solution for [Node.Js](https://nodejs.org)

A basic route in LaneJs looks like this : 
```
const { route }= require('lane-js/use/router');
module.export = {
  'paths': {
        "/": {
            method: 'GET',
            handler: (req, res) => {
                res.end("Hello")
            }
        }
    }
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
- Templating (Embedded Javascript, Handlebars and pug)
- Improved Performance 
- Body parsing support
- Param parsing support
- Namespacing


## A Quick guide to start with LaneJs
To quickly get started with LaneJs, go to  [https://github.com/SamDeka28/lanify07](https://github.com/SamDeka28/lanify07) and clone the repo.

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
const LaneJs = require("lane-js")

let urlConfig = {
  'paths': {
        "/": {
            method: 'GET',
            handler: (req, res) => {
                res.end("Hello")
            }
        }
    }
}

const app = LaneJs.Server({ urls : urlConfig })

app.listen(3000, "127.0.0.1", () => console.log("Server is up and running at port 3000"))
```

Thats all for creating the server

## Server Options
- **middlewares** : middlewares takes in an array of middleware function that can transform the request and the response object before it reaches the route handler.
```
const app = LaneJs.Server({ middlewares : [
    function lane(req, res) {
        console.log("hello")
        return [req, res]
    }
] })
```

- **urls** : this take a urlConfig object, that contains a `paths` key which is an object of routes defined for the application. Each path in the `paths` object is an object that should have two required keys - method, handler
```
let urlConfig = {
    "paths": {
        "/": {
          method : 'GET',
          handler : require("/path/to/route")
      }
    }
}
const app = Lane.Server({ urls : urlConfig })
```
- **template_directory** : the relative path for the directory that contains your static html or ejs files
```
const app = Lane.Server({ template_directory: "views" })
```
- **template_static** : the relative path for the directory that contains you static assets such as boostrap files, jquery files, images etc
```
const app = Lane.Server({ template_static: "views/static" })
```
- **template_engine** : the template engine that you are using, LaneJs supports ejs for rendering views.
```
const app = Lane.Server({ template_engine: "ejs" })
```

## UrlConfig
The urlConfig is an object where we define the `pathnames` for the routes we create in our application. This object should be passed in the `urls` key in the serverOptions object.  It has two keys :

- `paths` : this object contains key-value pair for our routes; the `key` being the pathname and the `value` being an object where we can define our `method`,`handler` and `middlewares` (`middlewares` is optional). The method is the `http` verb (GET, POST, PUT etc),the `handler` is the route handler function which takes two parameters `req` and `res` and the `middlewares` is an array of middleware functions. For example.
```
const urlConfig = {
  "paths" : {
      "/": {
        method : 'GET',
        middlewares : [sayhi] //assuming that sayhi is a middleware function
        handler : ( req, res) => {
          res.end("Hello World")
        }
      }
  }
}
```
- `namespace`: The `namespace` is a key that when defined, prepends to each `pathname` defined in the `paths` object of the urlConfig. This option can only be used with `pathify`. A simple example of using urlConfig using namespace is given below:

`urlConfig`
```
let urlConfig = {
  'namespace': "users",
  'paths': {
    "/index": {
      method : 'GET',
      handler: (req, res) => {
        res.end("Welcome to LaneJs")
      }
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

let app = Lane.Server(serverOptions)

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
        "/create" : {
          method : 'POST',
          handler : require(path/to/route)
        }
    }
}

let login = {
    paths : {
        "/login" : {
          method : 'GET',
          handler : require(path/to/route)
        }
    }
}

let urls = pathify(login,user)

const serverOptions = {
  urls: urls,
  template_directory: "views",
  template_static: "views",
  template_engine: "ejs"
}

let app = Lane.Server(serverOptions)

app.listen(3000, () => console.log('Server is up and running at 3000'))
```


## Routing

Creating a basic route in LaneJs :
```
module.export.index = (req,res) => {
    res.end("Welcome to LaneJs)
}
```
Once the route is created, you need to declare it in the *urlConfig*. Move to the urlConfig folder and open index.js. Declare the created route as : 
```
let { index } = require("/path/to/route")
const urlConfig = {
  "paths" : {
      "/": { method : 'GET', handler : index }
  }
}

module.exports = urlConfig
```

Once you have declared the route in the urlConfig, start the server `node app.js`. You can now use the route that you have created.

> Ensure that you have required the urlConfig in the app.js file and passed it to the server method as : `const app = LaneJs.Server({ urls : urlConfig })`

### Path Params

A basic example of defining path params is shown below:
```
let urlConfig ={
  paths : {
    "/user/:id" : { 
      method : 'GET',
      handler : ( req, res ) => {
        let id = req.params.id
        res.end(id)
      }
    } 
  }
}
``` 

The params can be accessed in a route using `req.params`

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
let Lane = require("lane-js")
var app = Lane.Server({ middlewares : [] })
```

- **Route level** : Route level middlewares are available for the route where it is declared. To use middlewares in a route, declare the `middlewares` key with an array of middlewares

``` 
"/user/:id" : { 
      method : 'GET',
      middlewares : [sayhi],
      handler : ( req, res ) => {
        let id = req.params.id
        res.end(id)
      }
    } 
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

To redirect to another path from a handler, we need to import  **redirect**  from `lane-js` as :
```
var { redirect } = require("lane-js")
```

The syntax for redirection is fairly simple
```
redirect(res,location)
```
Example : 
```
redirect(res,"https://www.google.com")
```
or
```
redirect(res,"/")
```

## Templating : 

LaneJs supports three templating engines -
- ejs
- hbs (handlebars)
- pug

To use any of these engines, you need to specify the `template_engine` in the serverOptions as:

- For ejs :
```
var app = LaneJs.Server({ template_engine : 'ejs' })
```

- For Handlebars (hbs) :
```
var app = LaneJs.Server({ template_engine : 'hbs' })
```

- For Pug :
```
var app = LaneJs.Server({ template_engine : 'pug' })
```

LaneJs provides you the `render` method to render a template using any of these engine.
To use the `render` method, you need to `require` it as :

```
var { render } = require('lane-js')
```

The `render` method takes in three parameters,
- the server response object
- the template name
- an object of renderables (if any)

The syntax for the render method is : 
```
render(res,template_name, renderable)
```

A basic example of rendering is provided below : 

```
let { render } = require("lane-js")

module.exports = {
  paths : {
    "/" : {
      method : 'GET',
      handler : (req,res) => {
        render( res, "index.html", { title : "Welcome to LaneJs" })
      }
    } 
  }
}
```
 
 > For more details on rendering, go to the respective website of the rendering engine you are about to use

### LICENSE 
Licensed under **MIT**
