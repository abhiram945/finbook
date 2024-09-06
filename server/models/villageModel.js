import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const villageSchema = new mongoose.Schema({
    villageName:{
        type:String
    },
    dayId:{
        type: mongoose.Types.ObjectId,
        ref: 'Day',
        index:true,
    }
})

villageSchema.plugin(mongooseAggregatePaginate)

export const Village = mongoose.model('Village',villageSchema);