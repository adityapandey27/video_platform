//4

import express from "express";

//5
import cors from "cors";
import cookieParser from "cookie-parser" 

const app=express();

//5
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials:true
}))

//form bharne ke baad data aayega
app.use(express.json({limit:"16kb"}));

//url se data
app.use(express.urlencoded({extended:true,limit:"16kb"}))

//pdf, image to store in our own server
app.use(express.static("public"))

//cookie parser to access user browser cookies and set also (CRUD) from our server
app.use(cookieParser());


//04-04-2024
//routes import
import userRouter from "./routes/user.router.js"


//routes decelration
// app.use("/users",userRouter)
//changing the above to version
app.use("/api/v1/users",userRouter);
export {app}