import "./db.js";
import express from "express";
import expressLayouts from "express-ejs-layouts";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";

const app = express();

app.set("view engine", "ejs");
app.set("views", process.cwd() + "/src/views");
app.use(expressLayouts);

app.use(express.urlencoded({ extended: true }));

app.use("/", rootRouter);
app.use("/user", userRouter);

export default app;
