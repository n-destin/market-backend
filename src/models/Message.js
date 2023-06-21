import mongoose, {Schema} from "mongoose";

const messageSchema = new Schema({
    Sender : String,
    Owner : mongoose.Types.ObjectId,
    Image : String,
    Text: String
})


export const Message = mongoose.model('Message', messageSchema);
