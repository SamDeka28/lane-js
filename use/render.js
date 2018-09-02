const fs = require('fs')
const readFile = fs.readFileSync
const config = require("../../../configs/config.json")
const path = require("path")
const ejs = require("ejs")
// Function : render(options : JSON) 
// #parameters : template_directory : optional (if not specified defaults to templates directory inside app root)
//             templateName : String (required)
//             page_title : String
//             page_content : String
//             template_engine : String
//             data : String (when template engine is ejs)
//             res : Object (server response object)
// ** the function is to be replaced by third party templating engine in the future
var render = async (options) => {
    
  var templateDir = ""
  
  options.template_directory == "" || options.template_directory == undefined ? templateDir = config.template_directory : templateDir = options.template_directory
  
  var templatePath = path.join(templateDir, options.templateName)
  
  if (options.template_engine == undefined) {
      try {
          var loaded = (readFile(templatePath)).toString()
          let content = ""
          if(options.replacable){
              for (const chunks in options.replacable) {
                  let toReplace = `~(${chunks})`
                  content = loaded.replace(toReplace,options.replacable[chunks])
                  loaded = content
              }
          }
          return loaded
      } catch (err) {
          console.log(err)
      }
  } else if (options.template_engine == "ejs" || config.template_engine == "ejs") {
      return await ejsrender(templatePath, options)
  }
  
}

const ejsrender = async (templatePath, options) => {
  var ejsrenderer = await ejs.renderFile(templatePath, options.data);
  return ejsrenderer;
}

module.exports.render = render
module.exports.ejsrender = ejsrender