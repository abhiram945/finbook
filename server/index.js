import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

import connectDb from "./db/connectDb.js";
import userRouter from "./routes/userRoute.js";
import villageRouter from "./routes/villageRoute.js";
import personRouter from  "./routes/personRoute.js";
import dayRouter from "./routes/dayRoute.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

app.get("/",(req,res)=>{
  res.send("Server is running...")
})
app.use("/api/v1/users", userRouter);
app.use("/api/v1/villages", villageRouter);
app.use("/api/v1/persons", personRouter);
app.use("/api/v1/days", dayRouter);

console.clear();
connectDb()
  .then(() => {
    app.listen(8000, () =>
      console.log("Server is running...")
    );
  })
  .catch((error) => {
    console.log(error);
  });
