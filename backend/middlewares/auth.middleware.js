import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const authMiddleware = async (req,res,next)=>{
  try {
    
      const Authorization = req.headers['authorization']
      const stored_AccessToken =  Authorization && Authorization.split(" ")[1] 
      if(!stored_AccessToken) return res.status(401).json({
          message:"No token found"
      })
  
     const decoded = jwt.verify(stored_AccessToken,process.env.Access_Token_Secret_Key)
     req.user= await User.findById(decoded.id).select("-password")
     //console.log(req.user)
      next();
  
  } catch (error) {
    error.message,
    console.log("Something went wrong in authmiddleware")
  }

}