import mongoose, {Schema} from "mongoose";
import bcrypt from  'bcryptjs'

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    Password: String,
    Email: String,
    phoneNumber: Number,
    Class: Number
},
{
    toJSON : {virtuals : true},
    toObject : { virtuals : true}
})

userSchema.pre('save', async function beforeSaving(next){
    const user = this;
    if(!user.isModified('Password')) return next;
    try {
        const salt = bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(user.Password, salt);
        user.Password = hashedPassword;
    } catch (error) {
        console.log(error.message);
    }
})

userSchema.methods.comparePasswords = async function comparePasswords(password){
    const user = this;
    return bcrypt.compare(user.Password, password);
}

const User = mongoose.model('User', userSchema);
export default User;