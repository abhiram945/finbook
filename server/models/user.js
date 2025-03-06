import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  gmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
});

const User = mongoose.model("User", userSchema);
export default User;