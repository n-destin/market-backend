import { Configuration,  OpenAIApi } from "openai";
import dotenv from 'dotenv'
dotenv.config({silent : true});

const configuration = new Configuration({apiKey : process.env.OPENAI_API_KEY})
const openai =  new OpenAIApi(configuration);

export async function generate(req, res){
    const message = req.body.message;
    // check message and API key
    console.log(message);
    if(configuration.apiKey == null){
        res.status(400).json(
            {error : {
                message: 'Check if you entered a correct message'
            }}
        );
    }
    const generatePrompt = async (message)=>{
        return `The following is a message from someone to another person. Extract every information that indicates names, contact information, and addresses and return the unchanged version of other content of the message. replace that information with [removed content]: : ${message}`
    }
    try {
        const completion = await openai.createCompletion({
            model: 'gpt-3.5-turbo',
            prompt : generatePrompt(message),
            temperature : .7
        })
        console.log(completion);
        console.log('reached here');
        res.status(200).json({processedMessage : completion.data.choices[0].text})
    } catch (error) {
        res.status(500).json({message : error.message})
    }
   
}