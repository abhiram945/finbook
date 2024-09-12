import mongoose from "mongoose";
import { Village } from "../models/villageModel.js";
import { Person } from "../models/personModel.js";
import { Day } from "../models/dayModel.js";

const addPerson = async (req, res) => {
  const { dayId, villageId, newCardNo, date, pageNo, personName, amountTaken } = req.body;
  const objectVillageId = new mongoose.Types.ObjectId(villageId);
  try {
    const existingCardNo = await Person.find({ villageId: objectVillageId, cardNo: newCardNo });
    if (existingCardNo.length !== 0) {
      return res.json({
        success: false,
        message: `cardNo ${newCardNo} exists`,
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
    let updatingDates = false;
    if (index === dayDates.length - 1) {
      function generateDatesOf10Weeks(startDate) {
        const dates = [];
        const start = new Date(startDate);
        for (let i = 0; i < 10; i++) {
          const weekStartDate = new Date(start);
          weekStartDate.setDate(start.getDate() + (i * 7));
          dates.push(new Date(weekStartDate.toISOString().split("T")[0]));
        }
        return dates;
      }
      updatingDates = true;
      const next10WeeksDates = generateDatesOf10Weeks(dayDates[index]);
      const addingNewDates = await Day.findByIdAndUpdate(
        { _id: dayId },
        [
          {
            $addFields: {
              dates: { $concatArrays: ["$dates", next10WeeksDates] }
            }
          }
        ],
        { new: true, runValidators: true }
      );
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
    res.json({
      success: true,
      message: `${personName} added`,
      updatingDates: updatingDates,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Failed to add ${personName}`,
      updatingDates: false,
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
      message: "getPersonsInVillage"
    })
  }
}




const updatePerson = async (req, res) => {
  const { dayId, personId, amount } = req.body;
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

    const updateTotalCollected = await Day.findByIdAndUpdate(
      { _id: dayId },
      [
        {
          $set: {
            totalCollected: { $add: ["$totalCollected", amount] },
            balance: { $subtract: ["$totalReturn", { $add: ["$totalCollected", amount] }] },
          },
        },
      ],
      { new: true, runValidators: true }
    );
    return res.json({ success: true, message: `${amount} added`, updatedDay: updateTotalCollected });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export { addPerson, getPersonsInVillage, updatePerson };
