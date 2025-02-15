import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  gmail: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  days: [{
    _id:false,
    name: String,
    number: Number,
    date: Date,
    total: Number,
    collected: Number,
    balance: Number,
  }],
  villages: [{
    name: String,
    day: String,
    id:  mongoose.Schema.Types.ObjectId,
  }]
}, {
  timestamps: true,
});

userSchema.index({ gmail: 0 });

const User = mongoose.model('User', userSchema);
export default User;
