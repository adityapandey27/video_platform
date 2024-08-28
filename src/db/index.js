import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";
import dotenv from "dotenv"
dotenv.config({  //important
    path:'./env'
})

const connectDB=async()=>{
    try{
       const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       console.log(connectionInstance.connection.host)
        console.log(`\n MONGODB connected !! DB HOST :${connectionInstance.connection.host}`);
        // above log to find out about the envirmont on which we are working
    }catch(error)
    {
        console.log("erorrrrrrrrrrrrrrrrrrrrrrrr")
        console.log("MONGOFB connect error",error);
        process.exit(1)   // research about it
        //if there is a error it terminates the program just after the one error
        // In Unix-like operating systems (including Linux and macOS), the convention
        // is that an exit status of 0 means success, and any non-zero value indicates an error.
        // So, when you call process.exit(1), you're indicating that the process 
        //is exiting due to an error. Other non-zero exit codes can be used to signify 
        //different types of errors or conditions that caused the process to exit.
    }
}

export default connectDB;