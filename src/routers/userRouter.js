import express from "express";
import {
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  logout,
  profile,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.route("/signup").get(getSignup).post(postSignup);
userRouter.route("/login").get(getLogin).post(postLogin);
userRouter.get("/logout", logout);
userRouter.get("/:id([0-9a-f]{24})/profile", profile);

export default userRouter;
