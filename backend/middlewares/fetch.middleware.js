import { User } from "../models/user.model.js";
import mongoose from "mongoose";



export const FetchUsermiddleware = async(req,res, next)=>{
    try {
        const  userId = req.params.id||req.user._id;
    
        const result = await User.aggregate([
         {   $match: {_id: new mongoose.Types.ObjectId(userId)}},
    
         {
            $lookup: {
              from: "relations",
              localField: "_id",
              foreignField: "mainUser",
              as: "Following"
            }
         },
         {
            $lookup: {
              from: "relations",
              localField: "_id",
              foreignField: "userFollowed",
              as: "Followers"
            }
          },
          {
            $project: {
              username: 1,
              Following: "$Following.userFollowed",
              Followers: "$Followers.mainUser",
              FollowingCount: { $size: "$Following" },
              FollowerCount: { $size: "$Followers" }
            }
          },
        ])
    
        req.profile= result[0]; // attach to req
        console.log("Profile fetch successfully")
        next();
    
    } catch (error) {
        res.status(500).json({message:"Something went wrong in fetch.middleware",error})
        console.log("Somethin went wrong in fetch.middleware",error)
    }
}