import mongoose from "mongoose";
import { Village } from "../models/villageModel.js";
import { Person } from "../models/personModel.js";
import { Day } from "../models/dayModel.js";

const addPerson = async (req, res) => {
  const { dayId, villageId, newCardNo, date, personName, amountTaken } = req.body;
  const objectVillageId = new mongoose.Types.ObjectId(villageId);
  try {
    const existingCardNo = await Person.find({villageId : objectVillageId, cardNo: newCardNo});
    if (existingCardNo.length !== 0) {
      return res.json({
        success: false,
        message: `cardNo ${newCardNo} exists`,
      });
    }

    const personDay = await Day.findById(dayId)
    let zerosArray=[]
    personDay.dates.map(d=>{
      if(d <= new Date(date)){
        zerosArray.push(0);
      }
    });

    const newPerson = await new Person({
      date: date,
      cardNo: newCardNo,
      personName: personName,
      amountTaken: amountTaken,
      weeks : zerosArray,
      villageId: villageId,
    }).save(); 

    const updateTotalReturnOnDay = await Day.findByIdAndUpdate(
      { _id: dayId },
      [
        {
          $set: {
            totalReturn: { $add: ["$totalReturn", Number(amountTaken)] },
            balance : {$subtract: [ { $add: ["$totalReturn", Number(amountTaken)] }, "$totalCollected"] }
          },
        },
      ],
      { new: true, runValidators: true }
    );
    res.json({
      success: true,
      message: `${personName} added`,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Failed to add ${personName}`,
    });
  }
};


const getPersonsInVillage=async(req,res)=>{
  const {villageId} = req.body;
  try {
      const personsInVillage = await Person.find({villageId:villageId});
      return res.json({
          success:true,
          message:personsInVillage
      })
  } catch (error) {
      res.json({
          success : false,
          message:"getPersonsInVillage"
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
            balance : {$subtract: [ "$totalReturn", { $add: ["$totalCollected", amount] }] }
          },
        },
      ],
      { new: true, runValidators: true }
    );
    return res.json({ success: true, message: `${amount} added` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



const deletePerson = async (req, res) => {
  const { person } = req.body;
  try {
    const deletedPerson = await Person.findByIdAndDelete(person._id);
    return res.json({
      success: true,
      message: `${person.personName} deleted`,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: `Failed to delete ${person.personName}`,
    });
  }
};

export { addPerson, getPersonsInVillage, updatePerson, deletePerson };
