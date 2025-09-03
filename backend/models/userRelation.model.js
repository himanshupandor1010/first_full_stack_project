import mongoose from "mongoose";

const userRelationSchema= new mongoose.Schema({
      mainUser:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User",
          required:true,
    },
      userWhoIsFollowedByMainUser:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User",
          required:true,
    }
},
    {
        timestamps:true,
})

userRelationSchema.index(
  { mainUser: 1, userWhoIsFollowedByMainUser: 1 },
  { unique: true }
);




export const Relation = mongoose.model("Relation",userRelationSchema)
