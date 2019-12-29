/**
 * Middleware function which processes function array with argument request and response
 * in the middlewares key passed in the server or in a route
 * @param {object} serverOption 
 * @param {object} request 
 * @param {object} response 
 */
function transformRequestResponse({ middlewares },request,response) {
  let hasNext;
  for (let middleware of middlewares) {
    hasNext = false
    middleware(request, response, function (err) {
        if (err) {
          if (err instanceof Error) {
            console.error(err)
            return
          }
          throw Error(err)
        } else {
          hasNext = true
        }
      })

    if (!hasNext)
      break;
  }
}
module.exports = transformRequestResponse