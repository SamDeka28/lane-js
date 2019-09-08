
# LaneJs - A REST and ROUTING solution for node
[![npm version](https://badge.fury.io/js/lane-js.svg)](https://www.npmjs.com/package/lane-js)  [![Known Vulnerabilities](https://snyk.io/test/github/SamDeka28/lane-js/badge.svg)](https://snyk.io/test/github/SamDeka28/lane-js)  [![npm](https://img.shields.io/npm/dt/lane-js.svg)](https://www.npmjs.com/package/lane-js) [![NpmLicense](https://img.shields.io/npm/l/lane-js.svg?registry_uri=https%3A%2F%2Fregistry.npmjs.com)](https://www.npmjs.com/package/lane-js)

LaneJs is a lightweight routing solution for [Node.Js](https://nodejs.org)

A basic route in LaneJs looks like this : 

Using `Routify`, you can create routes as (more on Routify below) - 
```
let { Routify } = require("lane-js");

let route = new Routify();

route.get( "/" , function(req,res){
  res.end("Inside GET method on Route /");
});

route.post("/", function(req,res){
  res.end("Inside POST method on Route /");
});

module.export = route.expose();
```

### Installing LaneJs
> before installing LaneJs, you must have node installed in your system. LaneJs relies on **async/await**, and therefore requires you to install **Node** version 7.6 or higher

LaneJs can be installed by using the `npm install` command
```
npm install lane-js --save
```
### Features 
- Fast Routing
- Middleware Support (with express middleware support)
- Templating (Embedded Javascript, Handlebars and pug)
- Improved Performance 
- Body parsing support
- Param parsing support
- Namespacing

### New in this version
- Response object middlewares

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
npm init -y
```
> the -y flag creates a default package.json for you

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
const { Server, Routify } = require("lane-js");

let route = new Routify();

route.get("/", (req, res) => res.end("Hello World"));

const app = Server({ urls: route.expose() });

app.listen(3000, "127.0.0.1", () => console.log("Server is up and running at port 3000")));
```

Thats all for creating the server

## Server Options
- **middlewares** : middlewares takes in an array of middleware function that can transform the request and the response object before it reaches the route handler.
```
const app = LaneJs.Server({ middlewares : [
    function lane(req, res, next) {
        console.log("hello");
        next();
    }
] });
```

- **urls** : this takes a **Routify** instance which defines the routes in the application. Mutliple Routify instances can also be passed to the urls with an array of Routify instances. 

```
let LanesJs = require("lane-js")

let route = new LaneJs.Routify();

route.get("/", (req,res) => res.end("Hello World"));

const app = LaneJs.Server({ urls : route.expose() }).listen(3000)
```

- **template_directory** : the relative path for the directory that contains your static html or template files
```
const app = LaneJs.Server({ template_directory: "views" })
```

- **template_static** : the relative path for the directory that contains you static assets such as boostrap files, jquery files, images etc
```

const app = LaneJs.Server({ template_static: "views/static" })
```
- **template_engine** : the template engine that you are using, LaneJs supports ejs | handlebars | pug for rendering views.
```

const app = LaneJs.Server({ template_engine: "ejs" })
```
- **cahce_control** : set the cache_control policy for the static files. By default, the cache_control is set to 'true'.
```
const app = LaneJs.Server({ cache_control: false })
```
- **https** : LaneJs by default serves request through HTTP1.1. To use `https`, pass the `https` option with SSL `key` and `cert`. Other `https` options can be passed to the `https` option.
 ```
const app = LaneJs.Server({ https: { key : key,cert : cert }})
```

## Pathify :
- This module is now a permanent implementation in lane-js

### Routing using Routify

Routify is a routing module which lets you write *express* like routes. Routes written using Routify desugars to the urlConfig convention used by LaneJs on application startup. Routify, by default, provides the following HTTP methods - 
- GET
- POST
- PUT
- PATCH
- DELETE

Writing routes using Routify requires you to first import the Routify module as
```
let { Routify } = require("lane-js");
```
After you have imported the Routify module, create a new instance of Routify as:
```
let routes = new Routify();
```
Routify also lets you use namespace your routes. Just pass a string representing the `namespace` in the Routify constructor as :
```
let route = new Routify('yournamespace');
```

A simple example of writing a route using Routify is given below :
```
let { Routify } = require("lane-js");

let route = new Routify("users");

route.get("/index", function(req,res){
  res.end("This path can be accesed from /users/index");
});

module.exports = route.expose();
```

`Routify.expose()` exposes all the routes created on a Routify instance so that it can be passed to the `urls` in the server.

> Routify lets you chain multiple http methods on one instance of Routify
```
let route = new Routify();

route.get("/" , (req, res) => res.end("Route get") )
  .post("/" , (req, res) => res.end("Route post) )
  .expose();

let app = Server({url : route})

app.listen(3000,_=>console.log("Server is up and running"));

```

### Path Params

A basic example of defining path params is shown below:
```
route.get("/user/:id", (req,res) => {
  let id = req.params.id
  res.end(id)
})

``` 

The params can be accessed in a route using `req.params`

> You can define multiple params in a path. eg : '/user/:id/name/:name'.

### Query Strings

The Query string of a url can be accessed in a route using `req.query`. `req.query` returns an object with key-value pairs.

For example: Suppose a user request an url `'http://localhost:3000/?fname=John&lname=Doe'`. The value of *fname* and *lname* can be accessed as `req.query.fname` and `req.query.lname` respectively.

## Middlewares

Middlewares are functions that manipulates the request and the response object. Middlewares in LaneJs are of three types : 
- **Application level** : Application level middlewares are available throughout the application.
To use a application level middleware, you need to declare it in the app.js file when you are creating the server by passing { middlewares : [ middlewarename ]} in the server method.
> the 'middlewares' is an array of middleware function. The middlewares will be executed in the sequence they are defined

```
let Lane = require("lane-js")
var app = Lane.Server({ middlewares : [] })
```

- **Router level** : Router level middlewares are available for all the routes of a Routify instance in which its has been defined. Router level middleware can be applied to the routes with **Routify.use()**. Routify.use() accept both single and an array of middleware functions.

``` 
let route = new Routify().use(morgan('dev'));

route.get("/" , (req, res) => res.end("Router level middlewares"));

```
- **Route level** : Using route level middlewares with Routify is simple, any number of functions passed between the first `parameter`(the pathname) and the last `parameter` (which is the handler function) are treated as middlewares. 

For example:
```
/**middleware one*/
let m1 = function(req,res,next){
  console.log("middleware 1");
  next();
}
/**middleware two*/
let m2 = function(req,res,next){
  console.log("middleware 2");
  next();
}

route.get( "/index" , m1, m2, function(req,res){
  res.end("This path can be accesed from /users/index");
});
```

### Creating your own middleware in LaneJs

Writing a middleware in **LaneJs** is identical to how you would create middlewares for **ExpressJs** ( The design is made similar to ensure support for a range of express middleware already out there on *npm*). Creating a middleware in LaneJs requires passing the ***request***, the ***response***, and the ***next*** function to the middleware function. Calling the `next()` function will pass the control to the next middleware in the stack. A basic example of a middleware function is shown below : 

``` 
function mymiddleware(req, res, next){
  req.sayHello = ()=>{
    return "Hello";
  }
  next();
}
```

Once you have created the middleware, declare it in a route or at an application level. Now, when you console log  `req.sayHello()`, "Hello" will be logged to the console.

For a middleware with options :

``` 
function mymiddleware( options ){
  return (req, res, next)=>{
    console.log(options);
    next();
  }
}
```
> Similar to Express, you can throw an `error` by passing an Error message or an error object to the next() function. For example:
> `next(new Error("There was and error while executing the middleware"))` or `next('Error in Middleware')`

## Response object

The response object now has the following methods added to it.
- **res.json** : Allows you to send JSON reponse. 
```
  res.json({message : "Welcome to LaneJs"});
```

- res.sendStatus: Allows you to set the reponse status code and send the message related to the code. For example:
```
  res.sendStatus(200);
  //equivalent to res.status(200).send('Ok');

  res.sendStatus(400);
  //equivalent to res.status(400).send('Bad request');
```

- res.status: Allows you to set the HTTP status for the response. It allows chaining other response methods.For example:
```
  res.status(200).json({message: "Success"});
```

- **res.download** : Transfers a file as an downloadable attachment. It takes two parameters: filepath, options(optional).
Options currently has only two configurable - root and downloadas.
Syntax
```
  res.download(filepath,{downloadas : filename,root : root_dir})
```
If downloadas option is not specified, the file will be downloaded as its name, otherwise the filename will be set to the provided name.

```
  res.download("/img.jpeg",{downloadas : "beatifulimage"});
```
> note that res.download allows downloading files only from the `template_static` set as ServerOptions for security reasons unless the root is set in the options.

Setting a different root
```
  res.download("avatar.jpg",{downloadas : "profile",root : "../public"});
```

- **res.sendFile**: Allows you to render a file based on its mime type.It takes two parameters: filepath, options(optional).
Options currently has only one configurable - root.

Syntax
```
  res.sendFile(filepath,{root : root_dir});
```
> note that res.sendFile allows accessing files only from the `template_static` set as ServerOptions for security reasons unless the root is set in the options.

- **res.render** : res.render is an extention of render method provided by lanejs to render a html file using the three template engines provided.
```
  res.render(filename,contextData)
```

- **res.redirect** : res.redirect is an extention of redirect method provided by lanejs to perform a redirection.
```
  res.redirect(location);
```


## Form handling

Use `express`'s ***body-parser*** module to handle form data.

> See [body-parser](https://www.npmjs.com/package/body-parser) documentation

## Multipart-data

Use [multer](https://www.npmjs.com/package/multer) or similar form handling modules to handle multipart data


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

**note**: From lanejs version 1.0.14, the redirect method has been added to the response object.
```
res.redirect("redirection_url");
```
## Templating : 

LaneJs supports these three templating engines -
- **ejs**
- **hbs** (handlebars)
- **pug**

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

LaneJs provides you the `render` method to render  a template using any of these engine.
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
const { render, Routify } = require("lane-js");

let route = new Routify();

route.get("/", (req, res) => render(res,"index.ejs"));

// route.get("/",(req,res)=>res.render("index.ejs",{message : "Welcome to laneJs})

module.exports =route.expose();
```
 
From version 1.0.14, a render method has been added to the response object.(See Response object for more details)

 > For more details on rendering, go to the respective website of the rendering engine you are about to use

## Enabling HTTPS: 

Enabling `https` requires an ssl certificate from a Certificate Authority. Once you have those, you can create a secure https server with LaneJs

A basic example of how to enable `https` in LaneJs is given below
```
const LaneJs = require("lane-js")
const fs = require("fs")

let route = new LaneJs.Routify();

route.get("/", (req, res) => render(res,"index.ejs"));

let httpsOptions = {
  key : fs.readFileSync(path/to/key),
  cert : fs.readFileSync(path/to/cert)
}

const app = LaneJs.Server({ urls : [route.expose()], https : httpsOptions })

app.listen(3000, "127.0.0.1", () => console.log("Server is up and running at port 3000"))
```

### LICENSE 
Licensed under **MIT**
