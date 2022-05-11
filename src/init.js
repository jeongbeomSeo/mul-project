import app from "./server";

const PORT = 5000;

const serverConnect = () => {
  console.log("Server Connecting Success ✅");
};

app.listen(PORT, serverConnect);
