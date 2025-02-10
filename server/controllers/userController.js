import { User } from "../models/userModel.js";
import { Day } from "../models/dayModel.js";
import { Village } from "../models/villageModel.js";
import { Person } from "../models/personModel.js";

import bcrypt from "bcryptjs";
import generateToekn from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const registerOrLogin = async (req, res) => {
  const { gmail, password } = req.body;
  return res.json({
    success:false,
    message:"Under maintanance"
  })
  if(!gmail.includes("@gmail.com")||password.trim().length<5){
    return res.json({success: false,message: "Gmail/Password is not valid"})
  }
  let existingUser = await User.findOne({ gmail: gmail });
  if (existingUser !== null) {
    try {
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        return res.json({
          success: false,
          message: "Invalid password",
        });
      } else {
        const token = await generateToekn(existingUser);
        return res.status(200).json({
          success: true,
          jwt: token,
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
        for (let i = 0; i < 5; i++) {
          const weekStartDate = new Date(start);
          weekStartDate.setDate(start.getDate() + (i * 7));
          dates.push(weekStartDate.toISOString().split("T")[0]);
        }
        return dates;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await new User({
        userName: gmail.split("@")[0],
        gmail: gmail,
        password: hashedPassword,
      }).save();

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

      const token = await generateToekn(newUser);
      return res.status(201).json({
        success: true,
        jwt: token,
        message: newUser,
      });
    } catch (error) {
      return res.json({
        success: false,
        message: "Please contact Finbook"
      })
    }
  }
}

const googleSignIn = async (req, res) => {
  return res.json({
    success:false,
    message:"Under maintanance"
  })
  const { data } = req.body;
  let existingUser = await User.findOne({ gmail: data.user.email });
  if (existingUser !== null) {
    try {
      const token = await generateToekn(existingUser);
      return res.status(200).json({
        success: true,
        jwt: token,
        message: existingUser,
      });
    } catch (error) {
      return res.json({
        success: false,
        message: "Try again to login"
      })
    }
  } else {
    try {
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
        for (let i = 0; i < 5; i++) {
          const weekStartDate = new Date(start);
          weekStartDate.setDate(start.getDate() + (i * 7));
          dates.push(weekStartDate.toISOString().split("T")[0]);
        }
        return dates;
      }
      const newUser = await new User({
        userName: data.user.name,
        gmail: data.user.email,
        password: "",
        photo:data.user.photo
      }).save();
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

      const token = await generateToekn(newUser);
      return res.status(201).json({
        success: true,
        jwt: token,
        message: newUser,
      });
    } catch (error) {
      return res.json({
        success: false,
        message: "Please contact Finbook"
      })
    }
  }
}



const verifyUser = async (req, res) => {
  return res.json({
    success:false,
    message:"Under maintanance"
  })
  const { token } = req.body;
  try {
    const verIfyJwt = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verIfyJwt._id);
    if (user) {
      return res.json({
        success: true,
        message: user
      })
    }
    else {
      return res.json({
        success: false
      })
    }
  } catch (error) {
    res.json({
      success: false
    })
  }
  return;
}

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find().sort({ userName: 1 });
    return res.json({ success: true, message: allUsers });
  } catch (e) {
    return res.json({ success: false, message: "Internal server error" });
  }
}

const deleteUserAccount = async (req, res) => {
  return res.json({
    success:false,
    message:"Under maintanance"
  })
  const session = await mongoose.startSession();
  session.startTransaction();
  const { userId } = req.body;
  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      res.json({ success: false, message: "User not found" });
      await session.abortTransaction();
      session.endSession();
      return;
    }
    const days = await Day.find({ user: userId }).session(session);
    const dayIds = days.map(day => day._id);

    const villages = await Village.find({ dayId: { $in: dayIds } }).session(session);
    const villageIds = villages.map(village => village._id);

    const batchDelete = async (Model, filter, batchSize = 100, session) => {
      let documents;

      do {
        documents = await Model.find(filter).limit(batchSize).select('_id').session(session);
        const ids = documents.map(doc => doc._id);

        if (ids.length > 0) {
          await Model.deleteMany({ _id: { $in: ids } }).session(session);
        }

      } while (documents.length > 0);
    };


    await batchDelete(Person, { villageId: { $in: villageIds } }, 100, session);
    await batchDelete(Village, { dayId: { $in: dayIds } }, 100, session);
    await batchDelete(Day, { user: userId }, 100, session);

    await User.findByIdAndDelete(userId).session(session);

    await session.commitTransaction();
    session.endSession();
    return res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.json({ success: false, message: "Internal error, try again" });
  }
};


export { registerOrLogin, googleSignIn, verifyUser, getAllUsers, deleteUserAccount };
