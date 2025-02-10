import { Day } from "../models/dayModel.js";

const getAllDaysData = async (req, res) => {
  const { userId } = req.body;
  return res.json({
    success:false,
    message:"Under maintanance"
  })
  try {
    const allDaysData = await Day.find({ user: userId }).sort({ dayNumber: 1 });
    return res.json({
      success: true,
      message: allDaysData
    })
  } catch (error) {
    res.json({
      success: false,
      message: "Failed to get All Days Data"
    })
  }
}

export { getAllDaysData };