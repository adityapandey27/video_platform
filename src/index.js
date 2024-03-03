// request('dotenv').config({path:'./env'});
//to manage code consistency writting above in different form
//3.1
import dotenv from "dotenv"

import mongoose from "mongoose";  //1
import { DB_NAME } from "./constants.js"; //1

//3.1 
import connectDB from "./db/index.js";

dotenv.config({  //important
    path:'./env'
})

connectDB()








// import express from "express";  //2
// const app= express(); //2

// //1
// ;(async ()=>{
//     try{
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

//     app.on("error",()=>{  //2  data base is connect but express is not connected
//         console.log("Error",error);
//         throw error
//     })

//     app.listen(process.env.PORT,()=>{   //2 if working fine then listen also
//         console.log(`App id listening on port ${process.env.PORT}`);
//     })
//     }catch(error){
//         console.log(error);
//         // console.error("Error",error)
//         throw err
//     }
// })()

// //1 // in last executed code, editor might have not put the semi at end there for we always put one from our sid.