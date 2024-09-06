import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const daySchema = new mongoose.Schema({
    dayName:{
        type:String
    },
    date:{
        type:Date,
    },
    dayNumber:{
        type:Number,
    },
    dates:{
        type:[Date]
    },
    totalReturn:{
        type:Number,
        default:0,
    },
    totalCollected:{
        type:Number,
        default:0,
    },
    balance:{
        type:Number,
        default:0,
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'Day',
        index:true,
    },
})

daySchema.plugin(mongooseAggregatePaginate)

export const Day = mongoose.model('Day',daySchema);