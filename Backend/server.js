import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouter from "../Backend/router/user.router.js";

dotenv.config();

const port = process.env.PORT;
const url = process.env.MONGODB_URL;

const app = express();

app.use(express.json());

app.listen(port, () => {
  console.log(`server is connected on http://localhost:${port}`);
  connectDB(url);
});

app.get("/", (req, res) => {
  res.send("Server Is Running");
});

app.use("/api/user", userRouter);
