import mongoose, {Schema} from "mongoose";
import bcrypt from  'bcryptjs'

const userStatus = {
    BUYER : 'BUYER',
    SELLER : 'SELLER'
}

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    Password: String, 
    Email: String,
    phoneNumber: Number,
    searchHistory : [String],
    Favorites : [Schema.Types.ObjectId],
    Transacations : [Schema.Types.ObjectId],
    DateJoined : Schema.Types.ObjectId,
    cartProducts : [Schema.Types.ObjectId],
    userConversations : [Schema.Types.ObjectId]
},
{
    toJSON : {virtuals : true},
    toObject : { virtuals : true}
})

userSchema.pre('save', async function beforeSaving(next){
    const user = this;
    if(!user.isModified('Password')) return next;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.Password, salt);
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