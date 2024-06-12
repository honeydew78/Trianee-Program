import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import jwt from "jsonwebtoken"

const registerUser = asyncHandler(async (req,res) => {
  const {fullName,email,username,password} = req.body

  if(
   [fullName,password,email,username].some((field) => field?.trim() === "")
  ){
   throw new ApiError(400,"All fields are required")
  }

  const existedUser = await User.findOne({
   $or: [{email},{username}]
  })

  if(existedUser){
   throw new ApiError(409,"User already exists")
  }

  const profilePicLocalPath = req.files?.profilePic[0]?.path;

  if(!profilePicLocalPath){
   throw new ApiError(400,"Profile pic path is required")
  }

  const profilePic = await uploadOnCloudinary(profilePicLocalPath)

  if(!profilePic){
   throw new ApiError(400,"ProfilePic file is required")
  }

  const user = await User.create({
   fullName,
   profilePic: profilePic.url,
   email,
   password,
   username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken")
  if(!createdUser){
   throw new ApiError(500,"Something went wrong while registering the user")
  }

  return res
  .status(201)
  .json(
    new ApiResponse(
      200,
      createdUser,
      "User registerd successfully"
    )
  )
})

export {
   registerUser
}