import { Post } from "../models/post.model.js";
import {Like } from "../models/like.model.js"
import { getPostLikeInfo } from "../Hooks/usegetPostLikesInfo.js";

export const PostHandler = async (req, res) => {
  try {
    const { post, caption } = req.body;
    const postUser = req.user?._id;
    const NewUpload = await Post.create({
      postUser,
      image: post,
      caption: caption,
    });
    res.status(200).json({
      message: "Post upload successfully",
      data: NewUpload,
    });
  } catch (error) {
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
