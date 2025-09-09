import mongoose from "mongoose";

const userRelationSchema= new mongoose.Schema({
      mainUser:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User",
          required:true,
    },
      userFollowed:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User",
          required:true,
         
    }
},
    {
        timestamps:true,
})

userRelationSchema.index(
  { mainUser: 1, userFollowed: 1 },
  { unique: true }
);




export const Relation = mongoose.model("Relation",userRelationSchema)
