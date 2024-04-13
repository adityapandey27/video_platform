import mongoose, { Schema } from "mongoose";   //1
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; //2

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema=new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true, // removre extra space before storing : ' 123' -> '123'
            index:true
            //agar hame pata hai ki iss key ko bht zada search karenge to usme index true krdo
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true, 
        },
        fullName:{
            type:String,
            required:true,
            trim:true, 
            index:true
        },
        avatar:{
            type:String, //will use cloudinary service for image url
            requried:true
        },
        converimage:{
            type:String,
        },
        watchhistory:[
            {
                type : Schema.Types.ObjectId,
                ref: "Video" 
            }
        ],
        password:{
            type:String,
            required:[true,"Password is required"],
        },
        refreshToken:{
            type:String
        }

    },
    {
        timestamps:true
    }
);
// userSchema.plugin(mongooseAggregatePaginate); //2 aggregation came after sometime,
//  so we can use it as an plugin

userSchema.pre("save", async function (next){  //3
    if(!this.isModified("password"))
    {
        return next()
    }
    this.password = await bcrypt.hash(this.password,10)
    next()


})
//bacause it will take some time there for making it async

userSchema.methods.isPasswordCorrect=async function(password){  //3
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=async function(){  //3
    //jwt have sign to genreate token, it take payload, buffer etch
   return jwt.sign(
        {
            //payload
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
 }

 userSchema.methods.generateRefreshToken=async function(){  //3
    //jwt have sign to genreate token, it take payload, buffer etch
   return jwt.sign(
        {
            //payload
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
 }

 userSchema.methods.generateRefereshToken=async function(){  //3
    return await bcrypt.compare(password,this.password)
 }
export const User= mongoose.model("User",userSchema);