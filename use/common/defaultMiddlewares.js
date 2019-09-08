
const {render} = require("../render")
const fs = require("fs")
const pathjs = require("path")
const statusCodes = {
  100: 'Continue',
  101: 'Switching Protocol',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-authoritative Information',
  204: 'No content',
  205: 'Reset content',
  206: 'Partial content',
  300: 'Multiple  Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See other',
  304: 'Not modified',
  305: 'Use Proxy',
  306: 'Unused',
  307: 'Temporary Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method not allowed',
  406: 'Not acceptable',
  407: 'Proxy authentication required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition failed',
  413: 'Request Entity too large',
  414: 'Request Url too long',
  415: 'Unsupported Media type',
  416: 'Requested Range not satisfiable',
  417: 'Expectation failed',
  500: 'Internal Server Error',
  501: 'Not implemented',
  502: 'Bad Gateway',
  503: 'Serive Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP version not supported'
}

let util = function (req, res, next) {
  const mime = {
    'js': 'text/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
  }
  /**
   * Set the status code
   */
  res.status = function (status) {
    res.statusCode = status;
    return this;
  }
  /**sendStatus */
  res.sendStatus = function (status, message, content) {
    if (!message) {
      message = statusCodes[status]
    }
    res.writeHead(status, content);
    res.end(message);
  }
  /**json */
  res.json = function (data) {
    res.setHeader('Content-type', "application/json");
    res.end(JSON.stringify(data));
    return this;
  }
  /**Download file */
  res.download = function (path, options) {
    if (path) {
      try {
        let root = req.template_static;
        let renameto;
        if (options && typeof options == "object") {
          if (options.hasOwnProperty("root")) {
            root = options.root;
          }
          if(options.hasOwnProperty("downloadas")){
              renameto = options.downloadas;
          }
        }
        if(!root){
          throw Error("No default Root set. Kindly set template_static in the serverOption or pass the root option")
        }

        path = pathjs.join(root, path)
        let fileExist = fs.existsSync(path);
        if (fileExist) {
          let file = fs.readFileSync(path);
          let ext=pathjs.extname(path)
          if (file) {
            if (renameto) {
              renameto = `filename = ${renameto}${ext}`;
            } else {
              let filename = path.split("\\");
              filename = filename[filename.length - 1];
              renameto = `filename = ${filename}`;
            }
            let disposition = `attachment; ${renameto} `;
            res.setHeader('Content-disposition', disposition);
            res.end(file);
          }
        } else {
          throw Error("File doesn't exist");
        }
      } catch (err) {
        throw Error(new Error(err));
      }
    }
  }
  /**View File Content*/
  res.sendFile = function (filepath, options) {
    if (filepath) {
      try {
        let defaultRoot =req.template_static;
        if(options && typeof options=="object" && options.hasOwnProperty('root')){
          defaultRoot=options.root;
        }
        if(!defaultRoot){
          throw Error("No default Root set. Kindly set template_static in the serverOption or pass the root option")
        }
        filepath =pathjs.join(defaultRoot,filepath)
        let file = fs.readFileSync(filepath);
        let filename = filepath.split("\\");
        filename = filename[filename.length - 1];
        let fileExt = pathjs.extname(filename).replace(".", '')
        res.setHeader('Content-type', mime.hasOwnProperty(fileExt) ? mime[fileExt] : 'text/plain')
        res.end(file);
      } catch (err) {
        res.end(err.toString())
        throw Error(new Error(err));
      }
    }
  }

  /**Response send */
  res.send = function (data) {
    if (typeof data == "object") {
      res.json(data);
    }
    if (typeof data == "string") {
      res.end(data)
    }
    if (typeof data == "buffer") {
      res.setHeader("Content-type", "application/octet");
      res.end(data);
    }
  }
  /** Render middleware */
  res.render = function (templatename, contextdate) {
    render(res, templatename, contextdate)
  }
  /**Redirect Middleware */
  res.redirect = function (location) {
    redirect(res, location)
  }

  next()
}

module.exports = util;