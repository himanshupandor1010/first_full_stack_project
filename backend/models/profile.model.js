import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    profileUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    bio:{
         type:String,
    },
    Avatar:{
        type:String, // store at cloudinary
    },
    gender:{
      enum: ["male", "female", "other"],   // allowed values
      default: "other"
    },
    isPravite:{
        type:Boolean,
        defalut:false
    },
},
    {
   timestamps:true,
})




export const Profile =  mongoose.model("Profile",profileSchema)
