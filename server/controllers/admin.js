import User from "../models/user.js"

export const getAllUsers=async(req,res)=>{
    try {
        const allUsers = await User.find();
        res.status(200).json({success:true, message:allUsers})
    } catch (error) {
        res.status(400).json({success:false, message:error.message||"Failed to get all users"})
    }
}