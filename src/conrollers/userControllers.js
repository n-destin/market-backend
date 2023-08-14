import User from "../models/user";
import jwt from 'jwt-simple';
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import Stripe from 'stripe'
var stripe = Stripe(process.env.STRIPE_SECRET_KEY)
dotenv.config({silent : true})

export function generateToken(user){
    console.log(user.id)
    const timestamp = new Date().getTime();
    return  jwt.encode({sub:user.id, iat: timestamp}, process.env.AUTH_KEY)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
}

export async function singupUser(fields){
    const user = new User;
    // create a stipe account, 
    console.log(process.env.STRIPE_SECRET_KEY);
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
    console.log(user);
    const Token = generateToken(user);
    return {Token, user};
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
