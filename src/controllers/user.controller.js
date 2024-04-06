import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudniary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
const registerUser= asyncHandler(
    async(req,res)=>{
        console.log("I am hereeeeeeeeeeeeeeee")

        // res.status(200).json({
        //     message:"Ok"
        // })
        // get all the user data
        // checke if email already exist
        // check if number already exit
        // if have preference for certain type of password then check it here
        // create a user object
        // return the response (remove : passowrd and referesh token)

        let {fullName,email,username,password}=req.body;
        // if(!fullName)
        // {
        //     throw new ApiError(400,"fullname is required")
        // } and need to do for all the rest field or can do
        if(
            [fullName,email,username,password].some
            (
                (field)=>field?.trim()===""
            )
        )
        {
            throw new ApiError(400,"All fields are required")
        }

        console.log("email",email);

        const existedUser= User.findOne({
            $or:[{email},{username}]
            //ya email mil jaye ya username mil jay
        })

        if(existedUser)
        {
            throw new ApiError(409,"User with Email or Username already exist")
        }

        // the below files key added by multer middleware
        const avatarLocalPath=req.files?.avatar[0]?.path
        const converImageLocalPath=req.files?.coverImage[0]?.path;

        if(!avatarLocalPath)
        {
            throw new ApiError(400,"Avatar file is required");
        }
       const avatar=await uploadOnCloudniary(avatarLocalPath)
       const coverImage= await uploadOnCloudniary(converImageLocalPath)

       if(!avatar)
       {
        throw new ApiError(400,"Avatar file is required");
       }

      const user= await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
       })

       const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
       )
       if(!createdUser)
       {
        throw new ApiError(500,"Something went wrong while registering the user")
       }
        return res.status(201).json(new ApiResponse(200,createdUser,"User Registered successfully"))
    }
)

export {
    registerUser
}