
module.exports = function paramParser(pathname, pathspec) {
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
  let params = {}
  let pathnameSplited = pathname.split("/")
  let pathspecSplited = pathspec.split("/")
  let pathnamelength = pathnameSplited.length
  let pathspeclength = pathspecSplited.length
  let diff = pathnamelength - pathspeclength
  for (let i = pathspeclength - 1; i != 0; i--) {
    if (pathspecSplited[i].indexOf(":") > -1) {
      params[pathspecSplited[i].replace(":", '')] = pathnameSplited[diff + i]
    }
  }
  return params
}