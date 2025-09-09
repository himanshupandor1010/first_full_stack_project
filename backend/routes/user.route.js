import express from "express";
import { FollowUserHandler, LoginHandler, ProfileHandler, SignUpHandler } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { FetchUsermiddleware } from "../middlewares/fetch.middleware.js";

const router = express.Router()

// router.get('/test',(req,res)=>{
//  console.log(req.headers.authorization)
//  res.send("See your console for header")
// })



//SignUpRoute
router.post("/signup",SignUpHandler);
router.post("/login",LoginHandler);

//secureRoutes
router.get("/profile/:id",authMiddleware,FetchUsermiddleware,ProfileHandler);
router.post("/follow",authMiddleware,FollowUserHandler);




export default router;