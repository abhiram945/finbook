import { Village } from "../models/villageModel.js";
import {Person} from "../models/personModel.js";
import { Day } from "../models/dayModel.js";
import mongoose, { mongo } from "mongoose";

const addVillage=async(req,res)=>{
    const {dayId, newVillageName} = req.body;
    const objectDayId = new mongoose.Types.ObjectId(dayId)
    try {

        const existingVillage = await Village.find({dayId:objectDayId, villageName:newVillageName});
        if(existingVillage.length!==0){
            return res.json({
                success:false,
                message:`${newVillageName} already added`
            })
        }
        const newVillage = await new Village({
            villageName:newVillageName,
            dayId: objectDayId
        }).save();
    
        return res.status(200).json({
            success:true,
            message : `${newVillageName} added`
        });
    } catch (error) {
        return res.json({
            success:false,
            message:"addVillage"
        })
    }
}


const getVillagesInDay = async (req, res) => {
    const { dayId } = req.body;
    const objectDayId = new mongoose.Types.ObjectId(dayId)
    try {
      const villagesInDay = await Village.find({dayId:objectDayId});
      return res.json({
        success: true,
        message: villagesInDay
      })
    } catch (error) {
      return res.json({
        success: false,
        message: "getVillagesInDay"
      })
    }
  }

export { addVillage, getVillagesInDay};