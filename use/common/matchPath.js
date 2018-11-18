module.exports = function matchPathName(pathname, pathmap) {
  let found = false
  let params = {}
  for (let i = 0; i < pathmap.length; i++) {
    if (!found) {
      let eachPath = pathmap[i]
      let path = []
      let newPathname = []
      path = eachPath.split("/")
      path.forEach((iPath, index) => {
        if (eachPath.indexOf(":") > -1) {
          if (iPath.indexOf(":") > -1) {
            newPathname = pathname.split("/")
            if (newPathname.length == path.length) {
              if (newPathname[index - 1] == path[index - 1]) {
                params[path[index].replace(":", '')] = newPathname[index]
                newPathname.splice(index, 1, iPath)
                pathname = newPathname.join("/")
                found = true
              }
            }
          }
        }
      })
    } else {
      break
    }
  }
  return { pathname: pathname, params: params }
}