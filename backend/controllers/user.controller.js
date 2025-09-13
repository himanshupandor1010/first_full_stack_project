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
    const stored_refreshToken = req.cookies?.refreshToken;
    if (stored_refreshToken) {
      try {
        // verify Refresh token
        jwt.verify(stored_refreshToken, process.env.refresh_Token_Secret_Key);

        // If no error, token is valid (not expired)
        return res.status(401).json({
          message: "already logged in. Please logout first.",
        });
      } catch (err) {
        // If error is TokenExpiredError → allow login
        if (err.name !== "TokenExpiredError") {
          return res.status(401).json({
            message: "Invalid token. Please logout first.",
          });
        }
        // if expired, continue with login
      }
    }

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const Access_token = generateAccessToken(user);
        const Refresh_token = generateRefreshToken(user);
        const hashed_refresh_token = await bcrypt.hash(Refresh_token, 10);
        user.refreshToken = hashed_refresh_token;

        await user.save();

        res.cookie("refreshToken", Refresh_token, {
          httpOnly: true,
          secure: false,
          sameSite: "none",
          maxAge: 5 * 24 * 60 * 60 * 1000,
          path: "/",
        });

        res.status(200).json({
          message: "user logged in successfully",
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            Access_token,
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

export const LogoutHandler = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({
        message: "You are already loggedOut",
      });
    }

    await User.updateOne(
      { refreshToken: refreshToken },
      { $unset: { refreshToken: "" } } // remove refreshToken from DB
    );

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "Strict",
      path: "/",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const FollowUnFollowUserHandler = async (req, res) => {
  try {
    const { profileUser } = req.params; // username  of user that main user want to follow
    const LoggedInUser = req.user?._id;
    const mainUser = await User.findById(LoggedInUser).select("username");
    const userToFollow = await User.findById(profileUser).select("username");

    if (LoggedInUser === profileUser) {
      return res
        .status(400)
        .json({ message: "you can not follow unfollow your self" });
    }

    if (!userToFollow) {
      return res.status(404).json({ message: "User to follow not found" });
    }

    const isFollowed = await Relation.findOneAndDelete({
      mainUser: LoggedInUser,
      userFollowed: profileUser,
    });

    if (!isFollowed) {
      const newFollow = await Relation.create({
        mainUser: LoggedInUser,
        userFollowed: profileUser,
      });
      return res
        .status(200)
        .json({
          message1: "Follow successfully",
          message2: `User ${mainUser.username} followed ${userToFollow.username} successfully`,
          newFollow,
        });
    } else {
      return res
        .status(200)
        .json({
          message1: "unFollow successfully",
          message2: `User ${mainUser.username} unfollow ${userToFollow.username} successfully`,
          unfollow: isFollowed,
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong in FollowUnFollowHandler" });
  }
};

