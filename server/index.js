import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

import connectDb from "./db/connectDb.js";
import userRoutes from './routes/user.js';

dotenv.config();

const corsOptions = {
  origin: "*",
  credentials: true,
  methods: "GET,POST",
  allowedHeaders: "Content-Type,Authorization",
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/v1/users', userRoutes);

connectDb()
  .then(() => {
    app.listen(8000, () =>
      console.log("Server is running on port:8000...")
    );
  })
  .catch((error) => {
    console.log(error);
  });
