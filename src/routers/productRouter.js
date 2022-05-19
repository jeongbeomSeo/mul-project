import express from "express";
import {
  getDetail,
  getList,
  getRegist,
  postRegist,
} from "../controllers/productController";
import { uploadImage } from "../middleware";

const productRouter = express.Router();

productRouter
  .route("/regist")
  .get(getRegist)
  .post(uploadImage.single("image"), postRegist);
productRouter.get("/list", getList);
productRouter.get("/:id([0-9a-f]{24})", getDetail);

export default productRouter;
