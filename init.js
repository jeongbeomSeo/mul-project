import express from "express";
import rootRouter from "./routers/rootRouter";

const PORT = 5000;

const app = express();

const serverConnect = () => {
  console.log("Server Connecting Success ✅");
};

app.use("/", rootRouter);

app.listen(PORT, serverConnect);
