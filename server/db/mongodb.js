require("dotenv").config();
const mongoose = require("mongoose");
const { Schema } = mongoose;
const URL = process.env.MONGODB_ATLAS_URL;
mongoose.connect(process.env.MONGODB_ATLAS_URL).then(() => { console.log("Connected to MONGODB...") }).catch(() => { console.log("Connection to MONGODB failed...") });

const user = new Schema({
  username: String,
  mail: String,
  password: String,
  days: []
});

module.exports = mongoose.model('user', user);
