import User from '../models/user.js';
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
  try {
    const { name, gmail, photo } = req.body;
    let token = "";
    if (gmail === process.env.ADMIN_GMAIL) {
      token = jwt.sign({ gmail: gmail }, process.env.JWT_SECRET)
    }
    const existingUser = await User.findOne({ gmail });
    if (existingUser) {
      return res.status(201).json({ success: true, isNew: false, message: {token:token, user:existingUser} });
    }
    const newUser = new User({
      name,
      gmail,
      photo
    });
    await newUser.save();
    res.status(201).json({ success: true, isNew: true, message: {token:token, user:newUser} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to register user" });
  }
};


export const updateSubscription = async (req, res) => {
  try {
    const { userId, newPlan } = req.body;
    const updatedSubscription = await User.findByIdAndUpdate(userId,
      {
        subscriptionPlan: newPlan,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: newPlan==="free"?null: new Date(new Date().setDate(new Date().getDate() + 30))
      },
      { new: true })
    res.status(200).json({ success: true, message: "Successfully upgraded to PRO" })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Failed to update subscription" })
  }
}

export const verifyAppVersionAndUserSubscriptionPlan=async(req,res)=>{
  try {
    const gmail = req.params.gmail;
    let existingUser = null;
    if(gmail){
      existingUser = await User.findOne({gmail})
    }
    res.status(200).json({success:true, message:{newVersion:"test",newFeatures:["Bug fixes","New dashboard","Enhanced UI","Better optimization"], userExists: existingUser ? true : false, user:existingUser}})
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Failed to validate App & User subscription" })
  }
}