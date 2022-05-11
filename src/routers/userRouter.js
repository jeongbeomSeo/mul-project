import express from "express";
import { getSignup, postSignup } from "../controllers/userController";

const userRouter = express.Router();

userRouter.route("/signup").get(getSignup).post(postSignup);

export default userRouter;
