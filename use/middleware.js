/*
  Middleware function which processes function array with argument request and response in the middlewares
  key passed in the server or in a route
*/
module.exports =  function transformRequestResponse(serverOption,request,response){
  if(serverOption && serverOption['middlewares']){
    if(serverOption.middlewares.length){
    
      for(let ini=0;ini<serverOption.middlewares.length;ini++){
        try{
          [request, response] = serverOption.middlewares[ini](request,response)
        }catch(err){
          console.log(err)
        }
      }
    }
  }  
  return {req : request, res : response}
}