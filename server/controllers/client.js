import mongoose from "mongoose";
import Client from "../models/client.js"
import { updateDayGiven, updateDayCollected } from "./user.js";

export const addClient = async (req, res) => {
    const { userId, day, villageId, name, amountTaken, date, cardNumber, page } = req.body;
    // date:new Date().toLocaleDateString("en-GB"),
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const newClient = new Client({
            userId, day, villageId, name, amountTaken,
            weeks: Array.from({ length: 3 }, () => 0),
            paid: 0, balance: amountTaken,
            date: new Date(date), cardNumber, page
        })
        await newClient.save({session});
        const {success, message} = await updateDayGiven(userId,day,amountTaken);
        if(!success){
            throw new Error(message)
        }
        await session.commitTransaction();
        res.status(200).json({ success: true, message: "Client added" })
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ success: false, message: error.message });
    } finally{
        await session.endSession();
    }
}

export const getClients=async(req,res)=>{
    const {villageId} = req.params;
    try {
        const clients = await Client.find({villageId})
        res.status(200).json({success:true, message:clients})
    } catch (error) {
        res.status(200).json({success:false, message:"Failed to get clients"})
    }
}

export const updateClient=async(req,res)=>{
    const {userId, day, clientId, amount} = req.body;
    const session = await mongoose.startSession()
    try {
        session.startTransaction();
        const client = await Client.findOneAndUpdate(
            {_id:clientId},
            [
                {$set:{
                    weeks:{$concatArrays:['$weeks',[amount]]},
                    paid:{$add:["$paid",amount]},
                    balance:{$subtract:["$amountTaken",{$add:["$paid",amount]}]}
                }}
            ],
            {new:true,session}
        )
        const {success, message} = await updateDayCollected(userId, day, amount);
        if(!success){
            throw new Error(message)
        }
        await session.commitTransaction()
        res.status(200).json({success:true, message:"Client updated"})
    } catch (error) {
        await session.abortTransaction()
        res.status(400).json({success:false, message:error.message})
    }finally{
        await session.endSession()
    }
}