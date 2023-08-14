import mongoose, {model, Schema} from "mongoose";

const conversationSchema = new Schema({
    belongsToItem: Schema.Types.ObjectId,
    user1id:Schema.Types.ObjectId, 
    user2id:Schema.Types.ObjectId, 
    messages : [Schema.Types.ObjectId]
})

export const Conversation =  mongoose.model('conversation', conversationSchema);