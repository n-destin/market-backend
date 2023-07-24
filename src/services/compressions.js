import { OpenAIApi, Configuration } from "openai";
import dotenv from 'dotenv'
dotenv.config({silent : true}) // be called when needed


const openai = new Configuration({
    apiKey : process.env.openAiKey
})

console.log('here is the key : ' + process.env.openAiKey);

export function generateMessage(req, res){
    const message  = req.message;
    if(!openai.apiKey){
        res.status // somethiung here
    }

    if(message.trim().length == 0){
        
    }
}