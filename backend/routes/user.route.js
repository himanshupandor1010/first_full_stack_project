import express from "express";
import { FollowUserHandler, LoginHandler, ProfileHandler, SignUpHandler, UnfollowUserHandler } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { FetchUsermiddleware } from "../middlewares/fetch.middleware.js";
import { Like_Unlike_Handler, PostHandler } from "../controllers/post.controller.js";

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
router.post("/unfollow",authMiddleware,UnfollowUserHandler);
router.post("/post",authMiddleware,PostHandler
);
router.post("/postId/like",authMiddleware,Like_Unlike_Handler)


export default router;