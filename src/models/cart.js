import mongoose, { Schema }  from "mongoose";


const cart = new Schema({
    Owner: String,
    Produtcs: [mongoose.Types.ObjectId]
})