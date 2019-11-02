/**
 * @class Routify
 * @param {*} namespace 
 */
let Routify = function (namespace) {
  this.urls = { paths: {} }

  this.middlewares = [];

  /**If a namespace is provided */
  if (namespace) {
    this.urls['namespace'] = namespace
  }
  /**
   * @method get
   * @param {string} path - the route path
   * @param {Function} args - handler functions 
   * @memberof Routify
   */
  this.get = (path, ...args) => {
    routeMaker(this, 'GET', args, path);
    return this
  }
   /**
   * @method post
   * @param {string} path - the route path
   * @param {Function} args - handler functions 
   * @memberof Routify
   */
  this.post = (path, ...args) => {
    routeMaker(this, 'POST', args, path);
    return this
  }
   /**
   * @method put
   * @param {string} path - the route path
   * @param {Function} args - handler functions 
   * @memberof Routify
   */
  this.put = (path, ...args) => {
    routeMaker(this, 'PUT', args, path);
    return this
  }
   /**
   * @method patch
   * @param {string} path - the route path
   * @param {Function} args - handler functions 
   * @memberof Routify
   */
  this.patch = (path, ...args) => {
    routeMaker(this, 'PATCH', args, path);
    return this
  }
   /**
   * @method delete
   * @param {string} path - the route path
   * @param {Function} args - handler functions 
   * @memberof Routify
   */
  this.delete = (path, ...args) => {
    routeMaker(this, 'DELETE', args, path);
    return this
  }
   /**
   * @method expose
   * @description Exposes the registered routes
   * @memberof Routify
   */
  this.expose = () => {
    return this.urls
  }
}
/**
 * 
 * @method Set Router level middleware
 * @param {any} middlewares - Can be an single or an array of middleware functions
 */
Routify.prototype.use = function (middlewares) {
  this.middlewares = middlewares
  return this
}

const extract = function extract(args, middlewares) {
  for (let i = 0; i < args.length - 1; i++) {
    middlewares.push(args[i]);
  }
  return middlewares
}

const routeMaker = function (ctx, verb, args, path) {
  let middlewares = [], handler;
  if (ctx.middlewares && typeof ctx.middlewares != "object")
    middlewares = [...middlewares, ctx.middlewares];
  else
    middlewares = [...middlewares, ...ctx.middlewares]
  let paths = ctx.urls.paths;
  middlewares = extract(args, middlewares);
  handler = args[args.length - 1];
  !paths.hasOwnProperty(verb) ? paths[verb] = {} : null
  ctx.urls.paths[verb][path] = { method: verb, middlewares, handler };
  return ctx;
}

module.exports.Routify = Routify