import { Post } from "../models/post.model.js";
import {Like } from "../models/like.model.js"
import { getPostLikeInfo } from "../Hooks/usegetPostLikesInfo.js";
import { Comment } from "../models/comment.model.js";
import { Profile } from "../models/profile.model.js";
import mongoose from "mongoose";

export const PostHandler = async (req, res) => {
  try {

    console.log("Enter in Post Handler")
    const { caption } = req.body;
    const post =  req.file?.path;  // single file

    if (!post) return res.status(400).send("No image uploaded");
    console.log(post)

    const postUser = req.user?._id;

    const NewUpload = await Post.create({
      postUser,
      image: req.file.path, // save only the file path or URL
      caption,
    });

    res.status(200).json({
      message: "Post uploaded successfully",
      data: NewUpload,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Something went wrong in Post Handler",
    });
  }
};


export const Like_Unlike_Handler = async (req, res) => {
  try {
    const post = req.params.id; // id of post that you want to like
    const likeUser = req.user?._id;

    const isExist = await Like.findOne({ post: post, likeUser: likeUser });
    if (isExist) {
      await Like.findOneAndDelete({ post: post, likeUser: likeUser });
      const fetchLikeInfo = await getPostLikeInfo(post);
      res.status(200).json({
        message: "Post Unlike Successfully",
         LikeInfo:fetchLikeInfo
      });
    } else {
      const newLike = await Like.create({
        likeUser,
        post,
      });
      
      const fetchLikeInfo = await getPostLikeInfo(post);
      console.log(fetchLikeInfo)
      res.status(200).json({
        message: "Post liked Successfully",
        LikeInfo:fetchLikeInfo
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong in Like_Unlike_Handler",
    });
  }
};

export const CommentHandler = async (req, res) => {
  try {
    const post = req.params.id; // id of post that you want to like
    const commentUser = req.user?._id;
    const { text } = req.body;
   
    console.log("1")

    const newComment = await Comment.create({
      commentUser,
      post,
      text
    })

    console.log("2")

    res.status(200).json({
       message:"comment added successfully",
       newComment
    })
   
  } catch (error) {
    res.status(500).json({
       message:"Something went wrong in Comment handler"
    })
   
  }
};


export const EditProfileHandler = async(req,res)=>{
    try {
      const {profileUser} = req.params   // this get string so we need to covert into ObjectId  // it also same name as in routes
     const {bio,gender,TypeOfAccount} = req.body
      const Avatar = req.file?.path
     // console.log(isPrivate)
     // console.log(Avatar)
    const isPrivate = TypeOfAccount.toLowerCase() === "true";
    //console.log(isPrivate)  
    //console.log(profileUser)            // string
    
      const profileUserId = new mongoose.Types.ObjectId(profileUser); // objectId
      console.log(profileUserId)
      const isProfileExists = await Profile.findOne({profileUser})
      if(isProfileExists){
       const UpdatedProfile =await Profile.findOneAndUpdate(
        { profileUser:profileUserId},
         {
          profileUser:profileUserId,
          Avatar:Avatar,
          bio:bio,
          gender:gender,
          isPrivate:isPrivate
        },
          {
             new: true
          }
         )
       return res.status(200).json({message:"Profile Updated Sucecssfully",UpdatedProfile})
      }else
      { 
        const newProfile = await Profile.create({
          profileUser:profileUserId,
          Avatar,
          bio,
          gender,
          isPrivate,
        })
        return res.status(200).json({message:"Profile Created Sucecssfully",newProfile})
      }
      
    } catch (error) {
      return res.status(500).json({message:"Something Went Wrong in EditProfileHandler",error})
    }
     

}
