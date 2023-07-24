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

const purposes  = {
    SELL : "SELL",
    RENT : "RENT",
    DONATE : "DONATE"
}

const productState = {
    SOLD : 'SOLD',
    RECIEVED : 'RECIEVED',
    BOOKED : 'BOOKED',
    UNSOLD : 'UNSOLD'
}

const conditions = {
    NEW : 'NEW',
    LIKE_NEW : 'LIKE_NEW',
    GOOD : 'GOOD',
    FAIR : 'FAIR',
    POOR : 'POOR'
}

const product = new Schema({
    Seller: mongoose.Types.ObjectId, 
    Image: [String],
    productName: String,
    productPrice: Schema.Types.Decimal128,
    productDescription: String,
    productCategory : {type: String, enum: categories}, // we need to keep both the cateogry and if it is a donation or not
    Purpose : {type: String, default : purposes.SELL, enum : purposes},
    productStatus: String,
    productOffers : [{amount :Schema.Types.Decimal128, Person : Schema.Types.ObjectId}], // people who offered money for the product
    productState : {type: String, enum: productState, default : productState.UNSOLD},
    productCondition : {type: String, required: true, enum : conditions},
}, {
    toJSON : {virtuals: true},
    toObject : {vituals : true},
    timestamps : true,
})

 const Product = mongoose.model('Product', product)
 export default Product