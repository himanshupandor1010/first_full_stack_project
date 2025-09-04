import express from "express";
import { LoginHandler, SignUpHandler } from "../controllers/user.controller.js";

const router = express.Router()

//SignUpRoute
router.post("/signup",SignUpHandler);
router.post("/login",LoginHandler);


export default router;