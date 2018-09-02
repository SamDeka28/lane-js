module.exports = function matchPathName(pathname, pathmap) {
  pathmap.forEach(eachPath => {
    let path = []
    let newPathMap = []
    let newPathname = []

    path = eachPath.split("/")
    path.forEach((iPath, index) => {
      if (eachPath.indexOf(":") > -1) {
        if (iPath.indexOf(":") > -1) {
          newPathname = pathname.split("/")
          if (newPathname.length == path.length) {
            if (newPathname[index - 1] == path[index - 1]) {
              newPathname.splice(index, 1, iPath)
              pathname = newPathname.join("/")
              return
            }
          }
        }
      }
    })
  })
  return pathname
}