import User from "../models/user";
import jwt from 'jwt-simple';
import { Timestamp } from "mongodb";
// import env from '../../.env'


export function generateToken(user){
    const timestamp = new Date().getTime();
    return jwt.encode({sub:user.id, iat: timestamp})                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
}

export async function singupUser(fields){
    const user = new User;
    Object.keys(fields).forEach(key=>{
        user[key]= fields[key];
    })
    await user.save();
    return generateToken(user);
}

export async function singIn(userFields){
    const user = await User.findOne({Email: userFields.email})
    return generateToken(user);
}