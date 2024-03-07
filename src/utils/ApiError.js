class ApiError extends Error{
    //all the thing which are written in constructor are required, in message we are writing static meesage in case if we do not get any message
    constructor(
        statuscode,
        message="Something went wrong",
        errors=[],
        stack=""

    ){
        supper(message)
        this.statuscode=statuscode
        this.data= null   //learn about this
        this.message= message
        this.success = false
        this.errors=errors



        //Below thing is very important  
        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }

    }
}

export {ApiError}