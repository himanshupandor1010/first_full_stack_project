import { User } from "../models/user.model.js";
import mongoose from "mongoose";

export const FetchPostmiddleware = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user._id;

    const result = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "postUser",
          as: "postdetails",
        },
      },
      {
        $lookup: {
          from: "likes",
          let: { postIds: "$postdetails._id" },
          pipeline: [{ $match: { $expr: { $in: ["$post", "$$postIds"] } } }],
          as: "likedetails",
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { postIds: "$postdetails._id" },
          pipeline: [{ $match: { $expr: { $in: ["$post", "$$postIds"] } } }],
          as: "commentsdetails",
        },
      },
       {
        $lookup: {
          from: "bookmarks",
          let: { postIds: "$postdetails._id" },
          pipeline: [{ $match: { $expr: { $in: ["$post", "$$postIds"] } } }],
          as: "bookmarkdetails",
        },
      },
      {
        $addFields: {
          posts: {
            $map: {
              input: "$postdetails",
              as: "p",
              in: {
                postId: "$$p._id",
                postUser: "$$p.postUser",
                image: "$$p.image",
                caption: "$$p.caption",
                Like: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$likedetails",
                        as: "l",
                        cond: { $eq: ["$$l.post", "$$p._id"] },
                      },
                    },
                    as: "likeUser",
                    in: "$$likeUser.likeUser",
                  },
                },
                LikeCount: {
                  $size: {
                    $filter: {
                      input: "$likedetails",
                      as: "l",
                      cond: { $eq: ["$$l.post", "$$p._id"] },
                    },
                  },
                },
                Bookmark: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$bookmarkdetails",
                        as: "b",
                        cond: { $eq: ["$$b.post", "$$p._id"] },
                      },
                    },
                    as: "bookmarkUser",
                    in: "$$bookmarkUser.bookmark_user",
                  },
                },
                BookmarkCount: {
                  $size: {
                    $filter: {
                      input: "$bookmarkdetails",
                      as: "b",
                      cond: { $eq: ["$$b.post", "$$p._id"] },
                    },
                  },
                },
                Comments: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$commentsdetails",
                        as: "c",
                        cond: { $eq: ["$$c.post", "$$p._id"] },
                      },
                    },
                    as: "commentUser",
                    in: {
                      commentUser: "$$commentUser.commentUser",
                      commenttext: "$$commentUser.text",
                    },
                  },
                },
                CommentCount: {
                  $size: {
                    $filter: {
                      input: "$commentsdetails",
                      as: "c",
                      cond: { $eq: ["$$c.post", "$$p._id"] },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          username: 1,
          posts: 1,
        },
      },
    ]);

    req.posts = result[0]; // attach to req
    console.log("Post fetch successfully");
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong in fetchPost.middleware", error });
    console.log("Something went wrong in fetchPost.middleware", error);
  }
};
