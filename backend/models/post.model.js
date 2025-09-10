import mongoose from "mongoose";

const postSchema= new mongoose.Schema(
    {  postUser:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true
        },
       image:{
              type:String,// from cloudinary
          },
       caption:{
               type:String,
           },
       
    

},{timestamps:true,})

export const Post =  mongoose.model("Post",postSchema)
