import { Profile } from "../models/profile.model.js";
import mongoose from "mongoose";


export const EditProfileHandler = async(req,res)=>{
    try {
     const {profileUser} = req.params   // this get string so we need to covert into ObjectId  // it also same name as in routes
     const {bio,gender,TypeOfAccount} = req.body
      const Avatar = req.file?.path
     // console.log(isPrivate)
     // console.log(Avatar)
    const isPrivate = TypeOfAccount.toLowerCase() === "true";
    //console.log(isPrivate)  
    //console.log(profileUser)            // string
    
      const profileUserId = new mongoose.Types.ObjectId(profileUser); // objectId
      console.log(profileUserId)
      const isProfileExists = await Profile.findOne({profileUser})
      if(isProfileExists){
       const UpdatedProfile =await Profile.findOneAndUpdate(
        { profileUser:profileUserId},
         {
          profileUser:profileUserId,
          Avatar:Avatar,
          bio:bio,
          gender:gender,
          isPrivate:isPrivate
        },
          {
             new: true
          }
         )
       return res.status(200).json({message:"Profile Updated Sucecssfully",UpdatedProfile})
      }else
      { 
        const newProfile = await Profile.create({
          profileUser:profileUserId,
          Avatar,
          bio,
          gender,
          isPrivate,
        })
        return res.status(200).json({message:"Profile Created Sucecssfully",newProfile})
      }
      
    } catch (error) {
      return res.status(500).json({message:"Something Went Wrong in EditProfileHandler",error})
    }
     

}

export const ProfileHandler = async(req,res)=>{

 const {profileUser} = req.params                                //string
 const profileUserId = new mongoose.Types.ObjectId(profileUser); // objectId
if(profileUserId.equals(req.user?._id))
{
  console.log("your are your own profile")
}
else{
  console.log("your are someone else profile")
}
res.status(200).json({
  message:`welcome to Profile of ${req.profile.username}`,
  profile: req.profile,
  posts:req.posts
})
}