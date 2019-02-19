
let Routify = function (namespace) {
  this.urls = { paths: {} }
  /**If a namespace is provided */
  if (namespace) {
    this.urls['namespace'] = namespace
  }
  /**get HTTP method */
  this.get = (path, ...args) => {
    return routeMaker(this, 'GET', args, path);
  }
  /**post HTTP method */
  this.post = (path, ...args) => {
    return routeMaker(this, 'POST', args, path);
  }
  /**put HTTP method */
  this.put = (path, ...args) => {
    return routeMaker(this, 'PUT', args, path);
  }
  /**patch HTTP method */
  this.patch = (path, ...args) => {
    return routeMaker(this, 'PATCH', args, path);
  }
  /**delete HTTP method */
  this.delete = (path, ...args) => {
    return routeMaker(this, 'DELETE', args, path);
  }
  /**EXPOSE THE URLS */
  this.expose = () => {
    return this.urls
  }
}

const extract = function extract(args, middlewares) {
  for (let i = 0; i < args.length - 1; i++) {
    middlewares.push(args[i]);
  }
  return middlewares
}

const routeMaker = function (ctx, verb, args, path) {
  let middlewares = [], handler;
  middlewares = extract(args, middlewares);
  handler = args[args.length - 1];
  ctx.urls.paths[path] = { method: verb, middlewares, handler };
  return ctx;
}

module.exports.Routify = Routify