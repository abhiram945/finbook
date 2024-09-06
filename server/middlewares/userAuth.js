import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

const authenticateUser = async (req,res,next)=>{
    const token = req.cookies.jwt;

    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select("-password");
            next();
        } catch (error) {
            res.status(401).json({
                success:false,
                message:"Not authorized, token failed"
            })
        }
    }else{
        res.status(401).json({
            success:false,
            message:"Not authorized, no token"
        })
    }
};

export default authenticateUser;