import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const personSchema = new mongoose.Schema({
    date:{
        type:Date,
    },
    pageNo:{
        type:Number,
    },
    cardNo:{
        type:Number
    },
    personName:{
        type:String
    },
    amountTaken:{
        type:Number,
    },
    paid:{
        type:Number,
        default:0
    },
    balance:{
        type:Number,
        default:function(){
            return this.amountTaken;
        }
    },
    weeks:{
        type:Array,
    },
    villageId:{
        type: mongoose.Types.ObjectId,
        ref: 'Village',
        index:true,
    }
})

personSchema.plugin(mongooseAggregatePaginate)

export const Person = mongoose.model('Person',personSchema);