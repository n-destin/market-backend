import mongoose, {Schema} from "mongoose";

const messageStates = {
    READ : 'READ',
    UNREAD : 'UNREAD'
}

const messageSchema = new Schema({
    Reciever : mongoose.Types.ObjectId,
    Sender : mongoose.Types.ObjectId,
    Text: String, 
    State : {type: String, enum:messageStates},
    timeSent : Date
})


export const Message = mongoose.model('Message', messageSchema);
