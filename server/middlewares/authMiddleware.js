import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ success: false, message: "Access denided" });
    }
    const decoded =await jwt.verify(token, process.env.JWT_SECRET);
    if(decoded.gmail!==process.env.ADMIN_GMAIL){
      return res.status(401).json({ success: false, message: "Access denided" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message||"Authorization failed" });
  }
};
