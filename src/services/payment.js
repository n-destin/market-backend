import Stripe from "stripe"
import dotenv from 'dotenv'
import Product from '../models/product'
import Transaction from "../models/Transaction"
dotenv.config({silent:true})
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
export async function stripeFunction(req, res){
    let product
    // get information the payment methods from db  we recieve ids of products from clinent, with the quanity of the each payment, in  a hashmap
    const checkoutProductIds = req.body.productIdsAndQuantiy; // an array of objects with 
    const priceObjectIdsAndQuantity =  (checkoutProductIds).map(productInfo=>{
        product = Product.findById(productInfo.productId);
        const priceId =  product.priceId; // remember the await function
        return {price : priceId, quantity : productInfo.quantity};
    }) 

    const session = await stripe.checkout.sessions.create({
        success_url : 'http://localhost:5173/',
        cancel_url :  'http://localhost:5173/sucsess', 
        payment_method_types : ['card'],
        mode : 'payment',
        line_items : priceObjectIdsAndQuantity,
    })
    if(session){
        // create a new transaction, productId, the person logged in (not yet available), and  I also need to access the userId from here
        const newTranstion = new Transaction();
        newTranstion[Seller] = product.Seller;
        newTranstion[TranscationAmount] = product.productPrice;
        newTranstion[TransactionType] = product.Purpose;
        newTranstion[TransactionTime] = Date().now;
        newTranstion[Product] = product._id;
        res.json({
            session_id : session.id
        })
    }
}

