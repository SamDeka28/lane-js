const fs = require('fs')
const registered_path = require("../../../configs/paths.map.json")
const config = require("../../../configs/config.json")
// implementation of the registerPaths method. It takes the pathname send by the callToRegisterPath method
function registerPaths(path) {
  // perform a check if the path map already contains the file, if yes, skips the path, if no, adds it to
  // path map
  if (!registered_path.paths.includes(path)) {
    console.log("Path",path,"generated")
    // the constructPathConfig method to push new path names to the existing path map object
    constructPathConfig(path)
    // creating the path map format to overwrite
    let json = { 'paths': registered_path.paths }
    try {
      // first clears the existing path maps in the paths.map.json file and writes the newly created path
      // maps into the file
      fs.truncate(config.app_root + "/configs/paths.map.json", (err) => {
        if (err)
        console.log(err)
        fs.writeFile(config.app_root + "/configs/paths.map.json", JSON.stringify(json), () => "written")
        
      })
    } catch (err) {
      console.log(err)
    }
  }
}

// this function is called by the registerPaths method, use recontruct the path map,
// by pushing new pathname into the existing path object and returning the newly created path object
// ** for now, the return is not used for any purpose
function constructPathConfig(path) {
  registered_path.paths.push(path)
  return registered_path.paths.length
}

module.exports = registerPaths