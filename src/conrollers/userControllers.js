import User from "../models/user";
import jwt from 'jwt-simple';

export function generateToken(user){
    return jwt.encode({sub:user.id})                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
}

export async function singupUser(fields){
    const user = new User;
    Object.keys(fields).forEach(key=>{
        user[key]= fields[key];
    })
    return await user.save();
}

export function singIn(user){
    return 
}
