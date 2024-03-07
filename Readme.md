1.  To store image : We ask to upload the image and store it temprairly on server in case any connection gets lost, but can direclty push on 3rd party platform.
2.  folder in src : mkdir controllers cd middlewares models routes utils
3.  add "Prettier" to project from npm to aviod the lots of conflicts
    a. add ".perttieringore" and ".prettierrc"
4.  in .env file MONGODB_URI = mongodb+srv://adityapandey272002:aditya27@cluster0.sipbjju.mongodb.net/ , we do not need last / . so remove it
    MONGODB_URI = mongodb+srv://adityapandey272002:aditya27@cluster0.sipbjju.mongodb.net
5.  src > constants (used to store value which we are not going to change frequently)
    a. for time being storin DB name : DB_NAME
6.  There are two ways using which we can do data base connectivity
    a. firstely index file gets executed by node/nodemon, so we can write db connection funtion here only
    b. can create db file, write function here then call in index and then execute (learner about process.exit)

            install mongoose, express and dotenv
            a. index.js


                 import mongoose from "mongoose";  //1

                import { DB_NAME } from "./constants"; //1

                import express from "express"; //2
                const app= express(); //2

                //1
                ;(async ()=>{
                try{
                await mongoose.connect(`${process.env.MONGOGB_URL}/${DB_NAME}`);

                    app.on("error",()=>{  //2  data base is connect but express is not connected
                        console.log("Error",error);
                        throw error
                    })

                    app.listen(process.env.PORT,()=>{   //2 if working fine then listen also
                        console.log(`App id listening on port ${process.env.PORT}`);
                    })
                    }catch(error){
                        console.log(error);
                        // console.error("Error",error)
                        throw err
                    }

                })()

                //1 // in last executed code, editor might have not put the semi at end there for we always put one from our sid.

            b. creat ne folder DB and index file
            


7. now db is connected and every thing is fine, now moving forward to app.js file
- here we create a app from express and then export it and go back to index.js
- there i had wrote connectDB,now after the db get connected, because it is async then it will return the promise
- now lets handel it
- before : connectDB()
- after : 
connectDB().then(()=>{
    
}).catch((err)=>{
    console.log("MONGO db connection failed",error);
})

8. when ever using middleware user app.user(cros());
- packages to install : a. cookie-parser  b. cors

9. configuring cros in app.js
10. writing other setting to make security strong.
11. Middle ware: before processing the request we check certain thing, it is done through middle ware, we can add multiple middle ware
12. (err,req,res,next) => next is used by middle ware, once the middle work is done it passes a flag call next

13. Go into utils ->  asyncHandler.js
14. updating error and creating our error
 utils > ApiError.js, thing written inside constructor are important and outer we are updating default values of error class
 - stack handling code is very important 
 15. handling res and req, we do not getting such thing from node, for that we are using express js