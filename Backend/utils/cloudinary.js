import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null
        //upload the file on cloudinary
        console.log("Attempting to upload file to Cloudinary:", localFilePath);
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto"
        })

        fs.unlinkSync(localFilePath)

        return response;
    }
    catch(error){
        console.log("Error in cloudinary", error.message);
        fs.unlinkSync(localFilePath)//remove the locally saved temparory file as the upload operation got failed

        return null
    }
}

export {uploadOnCloudinary}