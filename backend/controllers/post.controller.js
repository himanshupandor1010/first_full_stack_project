import { Post } from "../models/post.model.js";
import {Like } from "../models/like.model.js"
import { getPostLikeInfo } from "../Hooks/usegetPostLikesInfo.js";
import { Comment } from "../models/comment.model.js";
import { Bookmark } from "../models/bookmark.model.js";

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


export const BookMarkHandler = async(req,res)=>{
try {
    const post = req.params.id
    const bookmark_user = req.user?._id
  
    const isExist = await Bookmark.findOne({post,bookmark_user})
    if(isExist){
    const saved=  await Bookmark.findOneAndDelete({post,bookmark_user})
      res.status(200).json({
          message: "Post Unsaved Successfully",
          BookMarkInfo:saved
        });
    }
    else
    {
      const newSave = await Bookmark.create({
        post,
        bookmark_user
      })
       res.status(200).json({
          message: "Post saved Successfully",
          BookMarkInfo:newSave
        });
    }
} catch (error) {
        res.status(500).json({
          message: "Something Went Wrong in BookmarkHandler",
          error:error
  
        });
}
}
