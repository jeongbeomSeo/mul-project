import express from "express";
import {
  getDetail,
  getList,
  getRegist,
  getHistory,
  postRegist,
} from "../controllers/productController";
import { protectorMiddleware, uploadImage } from "../middleware";

const productRouter = express.Router();

productRouter
  .route("/regist")
  .all(protectorMiddleware)
  .get(getRegist)
  .post(uploadImage.single("image"), postRegist);
productRouter.get("/list", getList);
productRouter.get("/history", getHistory);
productRouter.get("/:id([0-9a-f]{24})", getDetail);

export default productRouter;
