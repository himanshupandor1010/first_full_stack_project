import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    profileUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    bio:{
         type:String,
         trim:true,
         validate:{
            validator:function(value){ 
                return value === undefined || value == null || value.trim().length>0;
            },
            message:"you  can not submit Empty Bio"
         }
    },
    Avatar:{
        type:String, // store at cloudinary
         validate:{
            validator:function(value){ 
                return value === undefined || value == null || value.trim().length>0;
            },
            message:"you  can not submit Empty Avatar"
         }
    },
    gender:{
      type: String,
      enum: ["male", "female", "other"],   // allowed values
      default: "other"
    },
    isPrivate:{
        type:Boolean,
        default:false
    },
},
    {
   timestamps:true,
})




export const Profile =  mongoose.model("Profile",profileSchema)
