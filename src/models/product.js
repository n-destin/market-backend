import mongoose, {Schema} from "mongoose";

const product = new Schema({
    Owner: mongoose.Types.ObjectId,
    Image: String,
    Name: String,
    Price: Number,
    Description: String,
    Views : {
        type: Number,
        defualt : 0,
    },
})

 const Product = mongoose.model('Product', product)
 export default Product