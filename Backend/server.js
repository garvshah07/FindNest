import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import userRouter from "../Backend/router/user.router.js";

dotenv.config();

const port = process.env.PORT;
const url = process.env.MONGODB_URL;

const app = express();

app.use(express.json());

const allowedOrigins = ["https://localhost:3000", "http://localhost:5173"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.listen(port, () => {
  console.log(`server is connected on http://localhost:${port}`);
  connectDB(url);
});

app.get("/", (req, res) => {
  res.send("Server Is Running");
});

app.use("/api/user", userRouter);
