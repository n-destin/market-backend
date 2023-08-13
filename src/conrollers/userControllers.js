import User from "../models/user";
import jwt from 'jwt-simple';
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import Stripe from 'stripe'
var stripe = Stripe(process.env.STRIPE_SECRET_KEY)

//loads if .env is needed
dotenv.config({silent : true})
// import env from '../../.env'




export function generateToken(user){
    const timestamp = new Date().getTime();
    return jwt.encode({sub:user._id, iat: timestamp}, process.env.AUTH_KEY)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
}

export async function singupUser(fields){
    const user = new User;
    // create a stipe account, 
    const stripeaccountid = await stripe.accounts.create({
        type:"express"
    })

    Object.keys(fields).forEach(key=>{
        console.log(key);
        user[key]= fields[key];
    })
    user[stripeaccountid] = stripeaccountid;
    await user.save();
    return generateToken(user);
}

export async function signIn(userFields){
    const user = await User.findOne({Email: userFields.Email})
    return generateToken(user);
}

export async function verifyEmail(email, userId){
    const transporter = nodemailer.createTransport({
        port : 245,
        host :'stmp.gmail.com',
        auth :{
            user: 'niyodestin73@gmail.com',
            pass : process.env.EMAIL_PASSWORD
        }
    })

    // generete a single-time used link
    // const singleTimeUseLink = `${}/${userId}
}
