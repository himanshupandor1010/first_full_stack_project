import express from "express";
import { FollowUserHandler, LoginHandler, LogoutHandler, SignUpHandler, UnfollowUserHandler } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { FetchUsermiddleware } from "../middlewares/fetchProfile.middleware.js";
import { CommentHandler, Like_Unlike_Handler, PostHandler } from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { EditProfileHandler, ProfileHandler } from "../controllers/profile.controller.js";
import { FetchPostmiddleware } from "../middlewares/fetchPost.middleware.js";

const router = express.Router()

// router.get('/test',(req,res)=>{
//  console.log(req.headers.authorization)
//  res.send("See your console for header")
// })



//SignUpRoute
router.post("/signup",SignUpHandler);
router.post("/login",LoginHandler);
router.post("/logout",LogoutHandler);

//secureRoutes
router.get("/profile/:id",authMiddleware,FetchUsermiddleware,FetchPostmiddleware,ProfileHandler);
router.post("/profile/:profileUser/editprofile",authMiddleware,upload.single('Avatar'),EditProfileHandler);

router.post("/follow",authMiddleware,FollowUserHandler);
router.post("/unfollow",authMiddleware,UnfollowUserHandler);
router.post("/post",authMiddleware,upload.single('post'),PostHandler  //uploading post router
);
router.post("/postId/:id/like",authMiddleware,Like_Unlike_Handler)
router.post("/postId/:id/comment",authMiddleware,CommentHandler)



export default router;