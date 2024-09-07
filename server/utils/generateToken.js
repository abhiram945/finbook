import jwt from "jsonwebtoken";

const generateToekn = async (user, res) => {
  const token = jwt.sign({ 
    gmail:user.gmail
   }, process.env.JWT_SECRET);

  // res.cookie("jwt", token, {
  //   httpsOnly: true,
  //   secure: true,
  //   sameSite: "none",
  //   maxAge: 30 * 24 * 60 * 60 * 1000,
  // });
  return token;
};

export default generateToekn;
