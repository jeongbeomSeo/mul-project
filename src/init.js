import "dotenv/config";
import app from "./server";

const PORT = 5000;

const serverConnect = () => {
  console.log(`Server Connecting Success PORT:${PORT} ✅`);
};

app.listen(PORT, serverConnect);
