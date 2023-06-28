import { Double } from "mongodb";
import mongoose, {Schema} from "mongoose";

const categories = {
    ELECTRONICS : 'ELECTRONICS',
    SPORTS_AND_LEISURE : 'SPORTS AND LEISURE',
    FASION_AND_ACCESSORIES : 'FASHION_AND_ACCESSORIES',
    ART_AND_COLLECTIBLES : 'ART_AND_COLLECTIBLES',
    AUTOMOTIVE :'AUTOMOTIVE',
    COMMUNITY : 'COMMUNITY'
}

const product = new Schema({
    Owner: mongoose.Types.ObjectId, 
    Image: [String],
    Name: String,
    Price: Schema.Types.Decimal128,
    Description: String,
    Category : {type: String, enum: categories},
    Donation : {type: Boolean, default: false},
    Status: String
}, {
    toJSON : {virtuals: true},
    toObject : {vituals : true}
})

 const Product = mongoose.model('Product', product)
 export default Product