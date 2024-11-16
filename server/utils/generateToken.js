import jwt from "jsonwebtoken";

const generateToekn = async (user) => {
  const token = jwt.sign({ 
    gmail:user.gmail,
    _id : user._id
   }, process.env.JWT_SECRET);
  return token;
};

export default generateToekn;
