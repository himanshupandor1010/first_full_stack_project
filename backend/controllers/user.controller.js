import mongoose from "mongoose";
import {
  generateAccessToken,
  generateRefreshToken,
  User,
} from "../models/user.model.js";
import bcrypt from "bcrypt";
import { Relation } from "../models/userRelation.model.js";

export const SignUpHandler = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email }],
    }).select("-password");

    if (user) {
      if (user?.username === username) {
        return res.status(400).json({
          message: "Username already exist",
        });
      }
      if (user?.email === email) {
        return res.status(400).json({
          message: "Email already exist",
        });
      }
    }

    const newUser = await User.create({ username, email, password });
    //console.log(newUser);
    return res.status(201).json({
      message: "User created succesfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while logged in",
      error: error.message,
    });
  }
};

export const LoginHandler = async (req, res) => {
  try {
    const { NameOrEmail, password } = req.body;
    const identifier = NameOrEmail;

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const Access_token = generateAccessToken(user);
        const Refresh_token = generateRefreshToken(user);
        const hashed_refresh_token = await bcrypt.hash(Refresh_token,10)
        user.refreshToken=hashed_refresh_token

        await user.save()

       

        res.cookie("refreshToken", Refresh_token, {
          httpOnly: true,
          secure: false,
          sameSite: "none",
          maxAge: 5 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
          message: "user logged in successfully",
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            Access_token
          },
        });
      } else {
        res.status(401).json({
          message: "Wrong Password",
        });
      }
    } else {
      res.status(404).json({
        message: "User is not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while logged in",
      error: error.message, // valid here
    });
  }
};


export const ProfileHandler = async(req,res)=>{
if(req.profile._id.equals(req.user?._id))
{
  console.log("your are your own profile")
}
else{
  console.log("your are someone else profile")
}
res.status(200).json({
  message:`welcome to Profile of ${req.profile.username}`,
  profile: req.profile
})
}


 export const FollowUserHandler = async(req,res)=>{
    try { 
     const{username:userFollowed} = req.body;  // username  of user that main user want to follow
     const mainUserId = req.user?._id;
     const mainUser = await User.findById(mainUserId).select("username");

      if (!userFollowed) {
      return res.status(400).json({ message: "you have mention user that you want to follow" });
    }

     if (mainUser.username=== userFollowed) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // ✅ Check if followed user actually exists
    const userToFollow = await User.findOne({ username: userFollowed });
    if (! userToFollow ) {
      return res.status(404).json({ message: "User to follow is  not found" });
    }
    
      const newFollow = await Relation.create({
        mainUser,
        userFollowed:userToFollow?._id
      })
    
      return res.status(201).json(
        {message1:"Followes successfully",
         message2:`User ${mainUser.username} followed ${userToFollow.username} successfully`,
      newFollow,}
        
         )
    } catch (error) {
      if(error.code===11000)
      {
        res.status(500).json({
          message:"you are already follow this user"
        })
      }
      res.status(500).json({ message: "Something went wrong in FollowUserHandler"});

    }


    
     
 }

 export const UnfollowUserHandler = async(req,res)=>{
  try {
     const {username:userToUnfollow_name} = req.body; // username of user that you want to unfollow
    
     const userToUnfollow = await User.findOne({
      username:userToUnfollow_name
     }).select("_id")
     if (!userToUnfollow) return; // handle user not found

     const mainUserId = req.user?._id
  
     await Relation.findOneAndDelete({mainUser:mainUserId,userFollowed:userToUnfollow?._id})

     res.status(200).json({
      message:"User unfollow Succesfully"
     })
      console.log("User unfollow Succesfully")
  
  } catch (error) {
    res.status(500).json({
      message:`Something went wrong in UnfollowUserHandler`,
      error:error
    })
    console.log("error in unfollowhandler")
  }
 }


 