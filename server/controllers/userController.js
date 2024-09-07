import { User } from "../models/userModel.js";
import { Day } from "../models/dayModel.js";
import bcrypt from "bcryptjs";
import generateToekn from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

const registerOrLogin = async (req, res) => {
  const { gmail, password } = req.body;
  let existingUser = await User.find({ gmail: gmail });
  existingUser = existingUser[0];
  if (existingUser) {
    try {

      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        return res.json({
          success: false,
          message: "Invalid password",
        });
      } else {
        const token =await generateToekn(existingUser, res);
        return res.status(200).json({
          success: true,
          isNew: false,
          jwt : token,
          message: existingUser,
        });
      }
    } catch (error) {
      return res.json({
        success: false,
        message: "Try again to login"
      })
    }
  } else {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await new User({
        userName: gmail.split("@")[0],
        gmail: gmail,
        password: hashedPassword,
      }).save();

      function generateDatesOf7Days() {
        const dates = [];
        const today = new Date();
        const todayDayIndex = today.getUTCDay();
        const startOfWeek = new Date(today);
        startOfWeek.setUTCDate(today.getUTCDate() - todayDayIndex);
        startOfWeek.setUTCHours(0, 0, 0, 0);
        for (let i = 0; i < 7; i++) {
          const weekDate = new Date(startOfWeek);
          weekDate.setUTCDate(startOfWeek.getUTCDate() + i);
          dates.push(weekDate);
        }
        return dates;
      }
      const datesOf7Days = generateDatesOf7Days();

      function generateDatesOf5Weeks(startDate) {
        const dates = [];
        const start = new Date(startDate);
        for (let i = 1; i <= 30; i++) {
          const weekStartDate = new Date(start);
          weekStartDate.setDate(start.getDate() + (i * 7));
          dates.push(weekStartDate.toISOString().split("T")[0]);
        }
        return dates;
      }

      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) =>
        new Day({
          dayName: day,
          date: datesOf7Days[index],
          dates: generateDatesOf5Weeks(datesOf7Days[index]),
          dayNumber: index + 1,
          user: newUser._id,
        }).save()
      )
      await Promise.all(days);

      const token =await generateToekn(newUser, res);
      return res.status(201).json({
        success: true,
        isNew: true,
        jwt : token,
        message: newUser,
      });
    } catch (error) {
      return res.json({
        success: false,
        message: "Please contact Finbook admin"
      })
    }
  }
}



const verifyUser = async(req,res)=>{
  const {token} = req.body;
  try {
    const verIfyJwt = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.find({gmail:verIfyJwt.gmail});
    res.json({success:true,
      message:user[0]})
  } catch (error) {
    res.json({
      success:false,
      message:"Please login again"
    })
  }
  return;
}

export { registerOrLogin, verifyUser };
