import {v2 as cloudinary} from 'cloudinary'; //1
import fs from "fs";  //2
import dotenv from "dotenv"
dotenv.config({  //important
  path:'./.env'
})
cloudinary.config({ //2
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET, 
});
const uploadOnCloudniary= async (localFilePath)=>{
  try{
    if(!localFilePath){
      //is not found return false
      return null
    }
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath,{
      resource_type: "auto"   //kon sa resource uplaod kr rahe hai
    })
    //file has been uploaded successfully

    //upload krne ke baad url get krne ke liye
    fs.unlinkSync(localFilePath)
    return response;
  }catch(error){
    // let if file not got uploaded nut we know the file is on our server and we 
    //need to clean it we need to remove the file from server
    fs.unlinkSync(localFilePath)  //remove the loclly saved temp file, as the upload operation got failed

  }
}

export {uploadOnCloudniary}