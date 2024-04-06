import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";
import dotenv from "dotenv"
dotenv.config({  //important
    path:'./env'
})
const connectDB=async()=>{
    try{
       const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MONGODB connected !! DB HOST :${connectionInstance.connection.host}`);
        // above log to find out about the envirmont on which we are working
    }catch(error)
    {
        console.log("erorrrrrrrrrrrrrrrrrrrrrrrr")
        console.log("MONGOFB connect error",error);
        process.exit(1)   // reseach about it
    }
}

export default connectDB;