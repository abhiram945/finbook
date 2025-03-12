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
  photo:{
    type:String,
  },
  subscriptionPlan:{
    type:String,
    default:"test"
  },
  subscriptionStartDate:{
    type:Date,
    required:false,
  },
  subscriptionEndDate:{
    type:Date,
    required:false
  }
});

const User = mongoose.model("User", userSchema);
export default User;