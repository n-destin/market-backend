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
    const User = this;
    if(!User.isModified('Password')) return next;
    try {
        const salt = bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(User.Password, salt);
        User.Password = hashedPassword;
    } catch (error) {
        console.log(error.message);
    }
})

userSchema.methods.comparePasswords = async function comparePasswords(password){
    const User = this;
    return bcrypt.compare(User.Password, password);
}

const User = mongoose.model('User', userSchema);
export default User;