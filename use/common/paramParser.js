
module.exports = function paramParser(pathname, pathspec) {
  let params = {}
  if (typeof pathspec == "object") {
    pathspec.forEach(spec => {
      params = extractor(pathname, spec)
    })
  } else {
    params = extractor(pathname, pathspec)
  }
  return params
}

function extractor(pathname, pathspec) {
  let path = []
  let newPathname = []
  let params = {}
  path = pathspec.split("/")
  path.forEach((iPath, index) => {
    if (pathspec.indexOf(":") > -1) {
      if (iPath.indexOf(":") > -1) {
        newPathname = pathname.split("/")
        params[`${path[index].replace(":", '')}`] = newPathname[index]
      }
    }
  })
  return params
}