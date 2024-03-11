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
-------------------------------------------------------------------------------------------
16. Creating the models :

1. User : 
- index : true , to make search more optimized
- trim : ture , to remove all the extra spaces : ' 123' => '123'

2. mongoose-aggregate-paginate-v2 : apart from genral update, save querry we have this package which helps us to use the true power of mongodb aggregate.
- npm i mongoose-aggregate-paginate-v2
3. package : both a and b are based on crypt graphy and both makes token
- a. bcrypt and bcryptjs :We are using core bcrypt, it hepls in hashing our password
  npm i bcrypt
- b. jwt : json web token ,web: jwt.io
  npm i jsonwebtoken
  It have 3 part
  1. header : which is automatically get injected, which contain info like which algo to use and other info
  2. payload/data: what ever data want to send, we write here
  3. verification signature: which includes a nice crypto graphic algorithm + a screate base64 encoded, with out 3rd part any one can encode beacuse info about the algo is publically avialable
  
4. To use bcrypt : we need to use "pre" hook of mongoose, which let us to do certain thing with our data just before it gets save in database, in our case we want to encrypt our password and then save it into database.
  - used in user model
  - userSchema.pre("save",async function (next){})
    a. it take two parameter 1. is the function onwhich want to use this hook and second one is call back function.
    b. never use it as  userSchema.pre("save",()=>{}), 
    - Access to this: With a regular function, this refers to the document being saved. This allows you to access and modify properties of the document before it's saved. Arrow functions, on the other hand, don't have their own this context, so this inside an arrow function will not refer to the document being saved.
    - In summary, use a regular function (function() {...}) when you need access to this (the document being saved) or when you want to handle errors within the middleware. Use an arrow function (async () => {...}) when you're not accessing this and when you need to use async/await for asynchronous operations.
    - in our case we deliberately using bcrypt so that we can customized the password filed before saving and to do so we need to access password using with "this" key which is not possible in ()=>{}
    - because it is a middleware, we need to call this next to pass on this flag, so that once our work is done we can pass on this 
    
    
    - userSchema.pre("save", async function (next){
    this.password = bcrypt.hash(this.password,10)
    next()
    })
    - it take two parmeter what to hash and how many round/salt
    - now by doing this new problem is created, if we change image or any other info this middle ware will run to prevent this and to only allow in cases where password is getting saved first time, or updating it we need to write some conditions

    -userSchema.pre("save", async function (next){
    if(!this.isModified("password"))
    {
        return next()
    }
    this.password = bcrypt.hash(this.password,10)
    next()
    })

    b. Till now we have checked if password is modified or not,
    now we can create out own methods. We are creating our customer method to check the password sent by user and stored passowrd

    userSchema.methods.isPasswordCorrect =
    async function(password)
    {
        return await bcrypt.compare(password,this.password)
    }

5. JWT : is a bearer token, means jo ye token bhejega usko data de denge
-  we write it main logic in env, Below both are JWT tokens
ACCESS_TOKEN_SECRET=can_write_any_random_value
ACCESS_TOKEN_EXPIRY=1d
REFERESH_TOKEN_SECRET=can_write_any_random_value_here_also
REFERESH_TOKEN_EXPIRY=10d
- 1st access token genrally have less time then 2nd access token
- We do not store access token in database but store referesh,
- REFRESH and ACCESS token will be written same way








