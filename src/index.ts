import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import router from "./router";
import errorMiddleware from "./middlewares/error-middleware.js";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "*",
  })
);
app.use("/api", router);
app.get("/", (req, res) => {
  res.send("WordStorm Backend Server");
});

app.use(errorMiddleware);

const start = async () => {
  try {
    console.log("  WordStorm");
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
