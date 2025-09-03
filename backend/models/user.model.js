import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"user name is required"]
    },
    email:{
        type:String,
        required:[true,"email is requied"]
    },
    password:{
        type:String,
        required:[true,"password is requied"]
    }
},{
    timestamps:true
})
export const User = mongoose.model("User",userSchema)



