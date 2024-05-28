require("dotenv").config();
const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const newUserSchema = require("./db/mongodb.js");

app.use(bodyParser.json());
app.use(express.json())
app.use(cors({
    origin:"*",
    credentials:true,
    methods:["GET","POST","PUT","DELETE"],
}));

app.listen(8080, () => {
    console.log("Server running on port 8080");
});
app.get("/",()=>{
    return res.json({message:"Root route."})
})
let userName = null;
app.post("/signin", async (req, res) => {
    const { mail, password } = req.body;
    try {
        const currentUser = await newUserSchema.findOne({ mail });
        if (currentUser) {
            userName = currentUser.username;
            if (currentUser.password === password) {
                return res.json({ message: "success", completeUserData: currentUser });
            }
            else {
                return res.json({ message: "Incorrect password" });
            }
        }
        else {
            let newUser = new newUserSchema({
                username: mail.split('@')[0],
                mail: mail,
                password: password,
                days: [
                    { day: "sunday", },
                    { day: "monday", },
                    { day: "tuesday", },
                    { day: "wednesday", },
                    { day: "thursday", },
                    { day: "friday", },
                    { day: "saturday", }
                ]
            });
            userName = newUser.username;
            await newUser.save();
            return res.json({ message: "success", completeUserData: newUser, new: true });
        }
    } catch (error) {
        return console.log("Error in signing in", error);
    }
});


app.post("/addVillage", async (req, res) => {
    const { userName, day, villageName } = req.body;
    try {
        const currentUser = await newUserSchema.findOne({ username: userName });
        let dayEntry = currentUser.days.find(d => d.day === day);
        if (dayEntry) {
            if (dayEntry.villages) {
                dayEntry.villages.push({ villageName: villageName });
            } else {
                dayEntry.villages = [{ villageName: villageName }];
            }
            currentUser.markModified('days');
        }
        await currentUser.save();
        return res.json({ message: "success", completeUserData: currentUser })
    } catch (error) {
        return console.log("Error adding a village", error);
    }
})


app.post("/addPerson", async (req, res) => {
    const { givenDate, cardNo, personName, totalAmount, villageName, day } = req.body.personFormData;
    try {
        const currentUser = await newUserSchema.findOne({ username: userName });
        let dayEntry = currentUser.days.find(d => d.day === day);
        let villageEntry = dayEntry.villages.find(v => v.villageName === villageName);
        let newPerson = {
            date: givenDate,
            cardNo: cardNo,
            name: personName,
            totalAmount: totalAmount,
        };
        if (villageEntry.persons) {
            villageEntry.persons.push(newPerson);
        } else {
            villageEntry.persons = [newPerson];
        }
        currentUser.markModified('days');
        await currentUser.save();
        return res.json({ message: "success", completeUserData: currentUser });
    } catch (error) {
        return console.log("Error adding a person", error);
    }
})


app.post("/editPerson", async (req, res) => {
    const {personToBeEdited,day,village,amount}=req.body;
    try {
        const currentUser = await newUserSchema.findOne({ username: userName });
        let dayEntry = currentUser.days.find(d => d.day === day);
        let villageEntry = dayEntry.villages.find(v => v.villageName === village);
        let personEntry = villageEntry.persons.find(p => p.name===personToBeEdited.name)
        if (personEntry.weeks) {
            const length = personEntry.weeks.length;
            personEntry.weeks.push({[length+1]:amount});
        } else {
            personEntry.weeks = [{1:amount}];
        }
        currentUser.markModified('days');
        await currentUser.save();
        return res.json({ message: "success", completeUserData: currentUser });
    } catch (error) {
        return console.log("Error adding a person",error);
    }
})

app.post("/deletePerson", async (req, res) => {
    const {personName,day,village}=req.body;
    try {
        const currentUser = await newUserSchema.findOne({ username: userName });
        let dayEntry = currentUser.days.find(d => d.day === day);
        let villageEntry = dayEntry.villages.find(v => v.villageName === village);
        if (villageEntry.persons) {
            villageEntry.persons = villageEntry.persons.filter(p => p.name !== personName);
            currentUser.markModified('days');
            await currentUser.save();
            return res.json({ message: "success", completeUserData: currentUser });
        }
    } catch (error) {
        return console.log("Error deleting a person",error);
    }
})