class GlobalError extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode || 500;
    }
}

export default GlobalError;

//Task: how to create a custom error handler by extending the Error and then throw error in try block and 
// then how to catch that error in the catch so that we can pass it to the express error handler middleware