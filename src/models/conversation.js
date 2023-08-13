import mongoose, {model, Schema} from "mongoose";

const conversationSchema = new Schema({
    conversationName : String,
    // belongsToItem: 
    // user1id:Schema.Types.ObjectId, //indexed field
    // user2id:Schema.Types.ObjectId, //indexed field
    messages : [Schema.Types.ObjectId]
})

export const Conversation =  mongoose.model('conversation', conversationSchema);