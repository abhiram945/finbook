import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import mongoose from 'mongoose';

export const registerOrLogin = async (req, res) => {
  const { gmail, password, name = "" } = req.body;
  const session = await mongoose.startSession();
  try {
    const userExists = await User.findOne({ gmail });
    if (userExists) {
      const isMatch = await bcrypt.compare(password, userExists.password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }
      const user = userExists.toObject();
      delete user.password;
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '365d' });
      res.status(200).json({ success: true, jwt: token, message: user, isNew: false });
      return;
    }

    session.startTransaction();
    const hashedPassword = await bcrypt.hash(password, 10);
    const startOfWeek = new Date();
    const currentDay = startOfWeek.getDay();
    const firstDayOfWeek = new Date(startOfWeek.setDate(startOfWeek.getDate() - currentDay));
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + i);
      return day;
    });
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const days = dayNames.map((dayName, index) => ({
      name: dayName,
      number: index + 1,
      date: weekDates[index],
      total: 0,
      collected: 0,
      balance: 0,
    }));
    const newUser = new User({ gmail, password: hashedPassword, name, days: days, villages: [] });
    await newUser.save({ session });
    const user = newUser.toObject();
    delete user.password;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '365d' });
    await session.commitTransaction();
    res.status(200).json({ success: true, jwt: token, message: user, isNew: true });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ success: false, message: error.message });
  } finally {
    await session.endSession();
  }
};

export const addVillage = async (req, res) => {
  const { userId, name, day } = req.body;
  const newVillage = {
    name,
    day,
  };
  try {
    const result = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { villages: newVillage } },
      { new: true } // This option returns the updated document
    );   
    res.status(200).json({ success: true, message: result.villages })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const updateDayGiven = async (userId, dayName, givenAmount) => {
  try {
    const updatedUser = await User.updateOne(
      { _id: userId, "days.name": dayName },
      [
        {
          $set: {
            days: {
              $map: {
                input: "$days",
                as: "elem",
                in: {
                  $cond: {
                    if: { $eq: ["$$elem.name", dayName] },
                    then: {
                      $mergeObjects: [
                        "$$elem",
                        {
                          total: { $add: ["$$elem.total", givenAmount] },
                          balance: {
                            $subtract: [
                              { $add: ["$$elem.total", givenAmount] },
                              "$$elem.collected"
                            ]
                          }
                        }
                      ]
                    },
                    else: "$$elem"
                  }
                }
              }
            }
          }
        }
      ]
    );
    return { success: true, message: "Day updated" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


export const updateDayCollected = async (userId, dayName, collectedAmount) => {
  try {
    const updatedUser = await User.updateOne(
      { _id: userId, "days.name": dayName },
      [
        {
          $set: {
            days: {
              $map: {
                input: "$days",
                as: "elem",
                in: {
                  $cond: {
                    if: { $eq: ["$$elem.name", dayName] },
                    then: {
                      $mergeObjects: [
                        "$$elem",
                        {
                          collected: { $add: ["$$elem.collected", collectedAmount] },
                          balance: {
                            $subtract: [
                              "$$elem.total",
                              { $add: ["$$elem.collected", collectedAmount] }
                            ]
                          }
                        }
                      ]
                    },
                    else: "$$elem"
                  }
                }
              }
            }
          }
        }
      ]
    );
    return { success: true, message: "Day updated" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

