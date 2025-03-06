import User from '../models/user.js';
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
  try {
    const { name, gmail } = req.body;
    if (!name || !gmail) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let token="";
    if(gmail===process.env.ADMIN_GMAIL){
      token = jwt.sign({gmail:gmail},process.env.JWT_SECRET)
    }
    const existingUser = await User.findOne({ gmail });
    if (existingUser) {
      return res.status(201).json({ success:true, isNew:false, message:token });
    }
    const newUser = new User({
      name,
      gmail,
    });
    await newUser.save();
    res.status(201).json({ success:true, isNew:true, message:token });
  } catch (error) {
    res.status(500).json({ success:false, message:error.message||"Failed to register user" });
  }
};
