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


app.get("/",(req,res)=>{
  res.send("Home route")
})

app.use('/api/v1/users', userRoutes);

app.use((err,req,res,next)=>{
  return res.status(err.statusCode).json({success:false, message:err.message||"Something went wrong"});
})

connectDb()
  .then(() => {
    app.listen(8000, () =>
      console.log("Server is running on port:8000...")
    );
  })
  .catch((error) => {
    console.log(error.message || error);
  });
