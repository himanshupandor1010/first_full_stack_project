import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    bookmark_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true 
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true 
    },
  },
  { timestamps: true }
);

export const Bookmark =  mongoose.model("Bookmark", bookmarkSchema);
