import mongoose from "mongoose";
import {
  generateAccessToken,
  generateRefreshToken,
  User,
} from "../models/user.model.js";
import bcrypt from "bcrypt";

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
  try {
    
    const ProfileUser_id = req.params?.id
    
    console.log("first is Ok")
    if(!mongoose.Types.ObjectId.isValid(ProfileUser_id)){
      return res.status(400).json({message:"You are trying to get invalid user"})
    }
    console.log("second is Ok")
    const ProfileUser = await User.findById(ProfileUser_id).select('-password')

    if(!ProfileUser){
     return res.status(404).json({
     //   error : error.message,
        message: "User Profile that you want to access is not there"
      })
    }
  
  console.log("third is Ok")
  
    const LoggedInUser = await User.findById(req.user?._id);
    if (!LoggedInUser) {
      return res.status(401).json({ message: "you are not LoggedIn" });
    }

    if(ProfileUser._id.equals(LoggedInUser?._id)){
       console.log("you are your own profile" ,LoggedInUser?.username)
    }
    else
    { 
     
      console.log("your profile is",LoggedInUser?.username)
      console.log("someone else profile",ProfileUser?.username)
    }
    
    res.status(200).json({
      message: "successfully reached on Profile"
    })
  } catch (error) {
  return  res.status(500).json({
      message: "something went wrong while finding user server side error"
    })
  }
}
