import mongoose from "mongoose";
import { Village } from "../models/villageModel.js";
import { Person } from "../models/personModel.js";
import { Day } from "../models/dayModel.js";

const addPerson = async (req, res) => {
  
  const { dayId, villageId, newCardNo, date, pageNo, personName, amountTaken } = req.body;
  const objectVillageId = new mongoose.Types.ObjectId(villageId);
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    const existingCardNo = await Person.find({ villageId: objectVillageId, cardNo: newCardNo });
    if (existingCardNo.length !== 0) {
      await session.abortTransaction();
      session.endSession();
      return res.json({
        success: false,
        message: `cardNo ${newCardNo} already added`,
      });
    }
    const personDay = await Day.findById(dayId)
    const dayDates = personDay.dates;
    let zerosArray = [];
    let index = -1;
    for (let i = (pageNo - 1) * 5; i < pageNo * 5; i++) {
      index = i;
      if (dayDates[i].toISOString().split("T")[0] <= String(date)) {
        zerosArray.push(0);
      }
    }
    const newPerson = await new Person({
      date: date,
      cardNo: newCardNo,
      pageNo: pageNo,
      personName: personName,
      amountTaken: amountTaken,
      weeks: zerosArray,
      villageId: villageId,
    }).save();


    const updateTotalReturnOnDay = await Day.findByIdAndUpdate(
      { _id: dayId },
      [
        {
          $set: {
            totalReturn: { $add: ["$totalReturn", Number(amountTaken)] },
            balance: { $subtract: [{ $add: ["$totalReturn", Number(amountTaken)] }, "$totalCollected"] }
          },
        },
      ],
      { new: true, runValidators: true }
    );

    await session.commitTransaction();
    session.endSession();
    return res.json({
      success: true,
      message: newPerson,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(401).json({
      success: false,
      message: `Failed to add ${personName}`,
    });
  }
};


const getPersonsInVillage = async (req, res) => {
  const { villageId } = req.body;
  try {
    const personsInVillage = await Person.find({ villageId: villageId });
    return res.json({
      success: true,
      message: personsInVillage
    })
  } catch (error) {
    res.json({
      success: false,
      message: "Unable to get Persons"
    })
  }
}


const updatePerson = async (req, res) => {
  const { dayId, personId, amount, pageNo, dayDates } = req.body;
  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      { _id: personId },
      [
        {
          $set: {
            weeks: { $concatArrays: ["$weeks", [amount]] },
            paid: { $sum: { $concatArrays: ["$weeks", [amount]] } },
            balance: {
              $subtract: [
                "$amountTaken",
                { $sum: { $concatArrays: ["$weeks", [amount]] } },
              ],
            },
          },
        },
      ],
      { new: true, runValidators: true }
    );

    const next5WeeksDates = [];
    if (dayDates.length === pageNo * 5) {
      const start = new Date(dayDates[dayDates.length - 1]);
      for (let i = 1; i <=5; i++) {
        const weekStartDate = new Date(start);
        weekStartDate.setDate(start.getDate() + (i * 7));
        next5WeeksDates.push(weekStartDate.toISOString().split("T")[0]);
      }
    }

    const updateDay = await Day.findByIdAndUpdate(
      { _id: dayId },
      [
        {
          $set: {
            dates: { $concatArrays: ["$dates", next5WeeksDates] },
            totalCollected: { $add: ["$totalCollected", amount] },
            balance: { $subtract: ["$totalReturn", { $add: ["$totalCollected", amount] }] },
          },
        },
      ],
      { new: true, runValidators: true }
    );

    return res.json({ success: true, message: `${amount} added`, updatingDates:next5WeeksDates.length!==0 });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export { addPerson, getPersonsInVillage, updatePerson };
