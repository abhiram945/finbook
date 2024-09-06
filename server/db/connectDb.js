import mongoose from "mongoose";

const connectDb=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS_URL);
        console.log("Connected to mongodb")
    } catch (error) {
        console.log("Failed to connect to MongoDB.")
    }
}

export default connectDb;