import express from "express";
import {
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  logout,
  profile,
  getChargeMoney,
} from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middleware";

const userRouter = express.Router();

userRouter
  .route("/signup")
  .all(publicOnlyMiddleware)
  .get(getSignup)
  .post(postSignup);
userRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
userRouter.get("/logout", protectorMiddleware, logout);
userRouter.get("/:id([0-9a-f]{24})/profile", profile);
userRouter.get("/:id([0-9a-f]{24})/chargeMoney", getChargeMoney);

export default userRouter;
