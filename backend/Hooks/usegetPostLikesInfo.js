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
          $lookup:{
            from:"comments",
            localField:"_id",
            foreignField:"post",
            as:"CommentsInfo"
          }
        },
        {
          $project:{
              _id: 1,
              LikesInfo:1,
              image:1,
              caption:1,
              CommentsInfo:1,
              LikeCount : {$size:"$LikesInfo"},
              CommentCount:{$size:"$CommentsInfo"}
          }
        },
  

      
    ])

     console.error("Post fetch successfully")

        return result[0]||null  
       
      
  } catch (error) {
    console.error("Error in getPostLikeInfo")
  }
}