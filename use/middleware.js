/**
 * Middleware function which processes function array with argument request and response
 * in the middlewares key passed in the server or in a route
 * @param {object} serverOption 
 * @param {object} request 
 * @param {object} response 
 */
async function transformRequestResponse(serverOption, request, response, setResponse) {
  let hasNext = true
  let middlewares
  if (serverOption && serverOption['middlewares']) {
    if (serverOption.middlewares.length) {
      for (let ini = 0; ini < serverOption.middlewares.length; ini++) {
        hasNext = false
        middlewares = new Promise(
          resolve => {
            try {
              serverOption.middlewares[ini](request, response, function (err) {
                if (err) {
                  if (err instanceof Error) {
                    console.error(err)
                    return
                  }
                  throw Error(err)
                } else {
                  hasNext = true
                  resolve([request, response])
                }
              })
            } catch (err) {
              console.log(err)
            }
          })
        if (!hasNext) {
          break
        }
      }
    }
    [request, response] = await middlewares
  }
  setResponse(request, response)
}
module.exports = transformRequestResponse 