//CREATING A WRAPPER FUNCTIONS SO THAT CAN BE USED EVERY WHERE
// THE FUNCTION CAN BE CREATED USING TWO WAYS
//1 USING PROMISE //2 USING TRY AND CATCH
const asyncHandler = (requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((error)=>next(error))
    }
}
export {asyncHandler}


// higher order function : are type of function which can take a function as an parameter 
//and can return 
//1. const asyncHandler =()=>{}
//2. const asyncHandler =(fn)=>{()=>{}}   
//2. const asyncHandler =(fn)=>{async()=>{}} or the below one
// const asyncHandler = (fn)=>async (req,res,next)=>{
//     try{
        
//         await fn(req,res,next)
//     }
//     catch(error){
//         res.status(error.code || 500).json({success:false,message:error.message})
//     }
// }
