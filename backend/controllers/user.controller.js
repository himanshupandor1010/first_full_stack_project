import { User } from "../models/user.model.js";


export const SignUpHandler =async (req,res)=>{
   try {
    const {username,email,password} = req.body;
    
    const user = await User.findOne({
     $or:[{username},{email}]
    }).select("-password");
    
    if(user)
    {
     if(user?.username===username)
     {
         return res.status(400).json({
             message:"Username already exist"
         })
     }
     if(user?.email===email)
     {
         return res.status(400).json({
             message:"Email already exist"
         })
     }
    } 
 
   const newUser = await User.create({username,email,password})
 
    res.status(201).json({
     message:"User created succesfully",
     user:{
         _id:newUser._id,
         username:newUser.username,
         email:newUser.email
     }
    })
   } catch (error) {
    return res.status(500).json({ message: error.message });
   }
   
    
}