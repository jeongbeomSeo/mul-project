import express from "express";
import { home, error } from "../controllers/objectController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/404", error);

export default rootRouter;
