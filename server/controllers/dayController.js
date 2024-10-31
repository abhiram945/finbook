import { User } from "../models/userModel.js";
import { Day } from "../models/dayModel.js";
import { Village } from "../models/villageModel.js";
import mongoose from "mongoose";


const getAllDaysData = async (req, res) => {
  const { userId } = req.body;
  try {
    const allDaysData = await Day.find({ user: userId }).sort({ dayNumber: 1 });
    return res.json({
      success: true,
      message: allDaysData
    })
  } catch (error) {
    res.json({
      success: false,
      message: "getAllDaysData"
    })
  }
}

export { getAllDaysData };