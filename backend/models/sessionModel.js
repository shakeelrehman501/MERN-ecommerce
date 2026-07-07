
import mongoose from "mongoose";

const sessionSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
}, {timestamps:true})

export const Session = mongoose.model("Session", sessionSchema)



