import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    gmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index:true
    },
    password: {
        required:true,
        type: String,
    },
    photo:{
        type:String,
        default:"",
    },
    isAdmin:{
        type:Boolean,
        default:false,
    }
});

userSchema.plugin(mongooseAggregatePaginate);
export const User = mongoose.model('User', userSchema);
