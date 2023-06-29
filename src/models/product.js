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

const productState = {
    SOLD : 'SOLD',
    RECIEVED : 'RECIEVED',
    BOOKED : 'BOOKED',
    UNSOLD : 'UNSOLD'
}

const product = new Schema({
    Seller: mongoose.Types.ObjectId, 
    Image: [String],
    productName: String,
    productPrice: Schema.Types.Decimal128,
    productDescription: String,
    productCategory : {type: String, enum: categories},
    donationStatus : {type: Boolean, default: false},
    productStatus: String,
    productOffers : [{amount :String, Person : Schema.Types.ObjectId}],
    productState : {type: String, enum: productState, default : productState.UNSOLD}
}, {
    toJSON : {virtuals: true},
    toObject : {vituals : true},
    timestamps : true,
})

 const Product = mongoose.model('Product', product)
 export default Product