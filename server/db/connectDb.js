import mongoose from "mongoose";
import GlobalError from "../middlewares/GlobalError.js";

const connectDb=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS_URL);
        console.log("Connected to mongodb")
    } catch (error) {
        throw new GlobalError("Failed to connect to MongoDB.")
    }
}

export default connectDb;