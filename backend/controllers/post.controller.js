import { Post } from "../models/post.model.js"


export const PostHandler = async (req , res )=>{
   try {
     const {post,caption} = req.body
     const postUser = req.user?._id
     const NewUpload = await Post.create({
         postUser,
         image : post,
         caption : caption
     })
    res.status(200).json({
     message:"Post upload successfully",
     data: NewUpload
     
     
    })
   } catch (error) {
     res.status(500).json({
     error:"Something went wrong in Post Handler"
     })
   }
}