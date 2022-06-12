import express from "express";
import { error } from "../controllers/objectController";
import { getList } from "../controllers/productController";

const rootRouter = express.Router();

rootRouter.get("/", getList);
rootRouter.get("/404", error);

export default rootRouter;
