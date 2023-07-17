import mongoose, {Schema} from "mongoose";

const messageSchema = new Schema({
    Reciever : mongoose.Types.ObjectId,
    Owner : mongoose.Types.ObjectId,
    Text: String, 
    timeSent : Date
})


export const Message = mongoose.model('Message', messageSchema);
