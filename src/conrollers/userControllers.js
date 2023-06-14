import User from "../models/user";

export async function singupUser(fields){
    const user = new User;
    Object.keys(fields).forEach(key=>{
        user[key] = fields[key];
    })
    return await user.save();
}
