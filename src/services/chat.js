import { Conversation } from "../models/conversation";
import User from "../models/user";

export async function getConversations(userId){
    const userConversationIds = await User.findById(userId).userConversations; // cannot get the userId
    let conversations;
    if(userConversationIds){
        userConversationIds.map(conversationId=>{
            const conversation = Conversation.findById(conversationId); 
            conversations[conversationId] = conversation;
        })
        return conversations;
    }
    return null;
}