import { Profile } from "../models/profile.model.js";
import mongoose from "mongoose";


export const EditProfileHandler = async(req,res)=>{
    try {
     const {profileUser} = req.params   // this get string so we need to covert into ObjectId  // it also same name as in routes
     const {bio,gender,isPrivateAccount} = req.body
      const Avatar = req.file?.path
     const LoggedInUser = req?.user.id
    const isPrivate = isPrivateAccount.toLowerCase() === "true"  
     if(!(LoggedInUser===profileUser))
     {
       return res.status(400).json({message:"you can not update other user Profile"})
      
     }
      const isProfileExists = await Profile.findOne({profileUser})
      if(isProfileExists){
       const UpdatedProfile =await Profile.findOneAndUpdate(
        { profileUser:profileUser},
         {
          profileUser:profileUser,
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
          profileUser:profileUser,
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

 const {profileUser} = req.params                               //string


 console.log(profileUser)
 console.log(req.user?._id)
if(profileUser === req.user?._id)
{
  console.log("your are  on your own profile")
}
else{
  console.log("your are  on someone else profile")
}
res.status(200).json({
  message:`welcome to Profile of ${req.profile.username}`,
  profile: req.profile,                                        // comes From fetchProfilemiddleware
  posts:req.posts                                              // comes From fetchPostmiddleware
})
}