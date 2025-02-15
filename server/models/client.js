import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    day:{
      type:String,
      required:true
    },
    villageId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    amountTaken: {
      type: Number,
      required: true,
    },
    weeks:{
      type:[Number],
      required:true
    },
    paid: {
      type: Number,
      required:true
    },
    balance: {
      type: Number,
      required:true
    },
    date: {
      type: Date,
      required: true,
    },
    cardNumber: {
      type: Number,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

clientSchema.index({dayId:1})
const Client = mongoose.model('Client', clientSchema);
export default Client;
