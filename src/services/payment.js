import Stripe from "stripe"
import dotenv from 'dotenv'
import Product from '../models/product'
import Transaction from "../models/Transaction"


dotenv.config({silent:true})
var stripe = Stripe(process.env.STRIPE_SECRET_KEY)
export async function stripeFunction(req, res){
    let product;
    const testApiPriceid = 'price_1NZ14LHceDFN1DB6dhPXOYXz'
    const TestproductQuantity = 2;
    const checkoutProductIds = req.body.productIdsAndQuantity; // an array of objects with object Ids and their coressponding qunatities
    const priceObjectIdsAndQuantityArray =  (checkoutProductIds).map(productInfo=>{
        product = Product.findById(productInfo.productId);
        const priceId =  product.priceId; // remember the await function
        return {price : testApiPriceid, quantity : TestproductQuantity};
    }) 
    const session = await stripe.checkout.sessions.create({
        success_url : 'http://localhost:5173/',
        cancel_url :  'http://localhost:5173/sucsess', 
        payment_method_types : ['card'],
        mode : 'payment',
        line_items : priceObjectIdsAndQuantityArray,
    })
    if(session){
        // create a new transaction, productId, the person logged in (not yet available), and  I also need to access the userId from here
        const newTranstion = new Transaction();
        newTranstion['Seller'] = product.Seller;
        newTranstion['TranscationAmount'] = product.productPrice;
        newTranstion['TransactionType'] = product.Purpose;
        newTranstion['TransactionTime'] = Date().now;
        newTranstion['Product'] = product._id;
        await newTranstion.save();
        res.json({
            session_id : session.id
        })
    }
}

