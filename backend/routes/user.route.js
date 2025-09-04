import express from "express";
import { SignUpHandler } from "../controllers/user.controller.js";

const router = express.Router()

//SignUpRoute
router.post("/signup",SignUpHandler);


export default router;