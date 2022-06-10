import express from "express";
import { postBuyItem, postSoldItem } from "../controllers/apiController";

const apiRouter = express.Router();

apiRouter.post("/:id([0-9a-f]{24})/sold", postSoldItem);
apiRouter.post("/:id([0-9a-f]{24})/buy", postBuyItem);

export default apiRouter;
