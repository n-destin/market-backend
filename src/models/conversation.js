import mongoose, {model, Schema} from "mongoose";

const conversationSchema = new Schema({
    conversationName : String,
    messages : [Schema.Types.ObjectId]
})

export const Conversation =  mongoose.model('conversation', conversationSchema);