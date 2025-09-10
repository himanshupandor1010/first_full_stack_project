import mongoose from "mongoose"
import { Post } from "../models/post.model.js"

export const getPostLikeInfo =  async (PostId)=>{
  try {
  
    const result = await Post.aggregate([
         
     
        {  $match :{_id : new mongoose.Types.ObjectId(PostId)}},
        {
          $lookup:{
              from:"likes",
              localField:"_id",
              foreignField:"post",
              as:"LikesInfo"
          }
        },

        {
          $project:{
              _id: 1,
              LikesInfo:1,
              image:1,
              caption:1,
              LikeCount : {$size:"$LikesInfo"}
          }
        },
  

      
    ])

        return result[0]||null// attach to req
        console.error("Post fetch successfully")
      
  } catch (error) {
    console.error("Error in getPostLikeInfo")
  }
}