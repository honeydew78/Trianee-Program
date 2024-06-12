import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Admin } from "../models/admin.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import jwt from "jsonwebtoken"

const registerAdmin = asyncHandler(async (req,res) => {
  const {fullName,email,username,password} = req.body

  if(
   [fullName,password,email,username].some((field) => field?.trim() === "")
  ){
   throw new ApiError(400,"All fields are required")
  }

  const existedAdmin = await Admin.findOne({
   $or: [{email},{username}]
  })

  if(existedAdmin){
   throw new ApiError(409,"Admin already exists")
  }

  const profilePicLocalPath = req.files?.profilePic[0]?.path;

  if(!profilePicLocalPath){
   throw new ApiError(400,"Profile pic path is required")
  }

  const profilePic = await uploadOnCloudinary(profilePicLocalPath)

  if(!profilePic){
   throw new ApiError(400,"ProfilePic file is required")
  }

  const admin = await Admin.create({
   fullName,
   profilePic: profilePic.url,
   email,
   password,
   username: username.toLowerCase()
  })

  const createdAdmin = await Admin.findById(admin._id).select("-password -refreshToken")
  if(!createdAdmin){
   throw new ApiError(500,"Something went wrong while registering admin")
  }

  return res
  .status(201)
  .json(
    new ApiResponse(
      200,
      createdAdmin,
      "Admin registerd successfully"
    )
  )
})

export {
  registerAdmin
}