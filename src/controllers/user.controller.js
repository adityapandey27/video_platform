import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudniary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
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

        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
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

export const loginUser= asyncHandler(async(req,res)=>{
    // get the username/ email+ get passowrd,
    // check if email is present or not.
    // checkout password.
    // if password is correct then generate the AT and RT and send it to user
    // send them in cookies.

    let {email,username,password}= req.body;
    if(!username || !password)
    {
        return new ApiError(400,"username or password is required");
    }
    const userQuerry={
        $or:[
            {username},{email}
        ]
    }
    const user=User.findOne(userQuerry);
    if(!user)
    {
        return new ApiError(404,"User does not exist");
    }

    const isPasswordValid=await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentail");
    }
    // if passowed is correct then create a access token and refresh token. creating a new method

   const {accessToken,refreshToken}= await generateAccessAndRefereshTokens(user._id);
   const loggedInUser= await User.findById(user._id).select("-password -refreshToken");
   

   //to send the cookies need to select some options/object key
   const options={
    httpOnly:true,
    secure:true
   }
   //default behaviour: cookies can be modified by anyone(frontend), 
   //to prevent this behiavour and only allow modification from server
   //then do the above steps
   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
        new ApiResponse(200,
        {
            user:loggedInUser,accessToken,refreshToken
        }   ,
            "User loggedIn successfully"
        )
   )


})

export const logoutUser= asyncHandler(async(req,res)=>{
    //to logout the user first need to clear the cookies and need to remove the refreshToken
    //for logout purpose we do not take cred, so how we gonna do logout
    //we are going to create a middle ware for these purpose
    await User.findByIdAndUpdate(req.user._id,{
        $set:{
            refreshToken:undefined
        }
    },
    {
        new:true
    }
    )

    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User is logged out"))    
    
})

const generateAccessAndRefereshTokens=async(userId)=>{
    try{

        const user= await User.findById(userId);
        const accessToken=user.generateAccessToken();
        const refereshToken=user.generateRefereshToken();
        
        user.refereshToken=refereshToken;
        //saving the referesh token into database
        await user.save({validateBeforeSave:false});
        //various field are required in model which are written by us,if going to directly save them it will tigger some error
        return {accessToken,refereshToken}
    }catch(error){
        throw new ApiError(500,"Something went wrong while generating referesh and access token")
    }
}


const refreshAccessToken=asyncHandler(async(req,res)=>{

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    //take it and decode it
    // after find the user based on it
    // if user found check this token and stored in db
    // if every thing is fine genearte new one and store again
    try{
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )

    }
    catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})


const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        //new true bring data after the updation, else will bring data available before updation
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});


const updateUserAvatar= asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    //TODO: delete old image - assignment

    const avatar = await uploadOnCloudniary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})


const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    //TODO: delete old image - assignment


    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover image updated successfully")
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
}