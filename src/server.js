import "./db.js";
import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middleware.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", process.cwd() + "/src/views");
app.use(expressLayouts);

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);

app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/user", userRouter);

export default app;
