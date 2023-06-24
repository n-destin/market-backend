import mongoose, { Schema }  from "mongoose";


const cart = new Schema({
    Owner: mongoose.Types.ObjectId,
    Products: [mongoose.Types.ObjectId]
})

export const Cart = mongoose.model('Cart', cart);