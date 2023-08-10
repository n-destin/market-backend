import User from "../models/user";
import { Router } from "express";
import { signIn, singupUser } from "../conrollers/userControllers";
import {requireAuthentication, requireLogin} from '../services/passport'
import getS3Url from '../services/amazon'
import  Product  from "../models/product";
import dotenv from 'dotenv'
import * as productFunction from '../conrollers/proudctControllers'
import { Cart } from "../models/cart";
import produce from 'immer'
import {middlewareexample} from '../services/amazon'
import Search from '../conrollers/proudctControllers'
import {stripeFunction} from '../services/payment'
import Stripe from "stripe";
import { BSON } from "mongodb";
import {generate} from '../services/gpt'

const ourPercentage = .24;
dotenv.config({silent : true})
const router =  Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
router.get('/', async (req, res)=>{
    res.json("If you are reading this message, it means that I hacked your computer")
})
router.post('/signup', async (req, res)=>{
    const userInfo = req.body;
    const userId = new Date.now()
    const Fields = userInfo.userInfo;
    try {
        const userEmail = Fields.Email;
       const Token =  await singupUser(Fields);
       const userInfoForFrontEnd = {firstName : Fields.firstName, lastName : Fields.lastName, userEmail: Fields.Email, phoneNumber : Fields.phoneNumber}
       console.log(Token);
       res.json({UserToken : Token, authKey : process.env.AUTH_KEY, userInfo : userInfoForFrontEnd});
    } catch (error) {
        console.log(error.message);
    }
})


router.post('/signin', requireLogin, async (req, res)=>{
    console.log('reached in the login');
    const Token = signIn(req.body);
    res.json({UserToken: Token});
})
router.post('/posting', async (req, res)=>{
    res.json({message : 'this is a response'})
})

router.post('/addtocart',requireAuthentication, (req,res)=> { req.user }) // get them here 

router.get('/products', async (req, res)=>{
    console.log('reached in the products routes');
    const products = await Product.find();
    console.log(products);
    res.json(products)
})

router.get('/getProduct/:id', async (req, res)=>{
    const id = req.params.id
    try {
        const product = await Product.findById(id)
        res.json(product)
    } catch (error) {
        console.log(error.message);
    }
})

 // wrap everything into try and catch //
router.post('/createProduct', requireAuthentication, async (req, res)=>{
    console.log('reached in the backend creating');
    const newProduct = new Product;
    const id = req.user.id;
    newProduct.Owner = id;
    const Fields = req.body;
    const pricingInfo = await productFunction.createProductAndPrice(Fields.productName, Fields.productPrice, 'usd')
    newProduct[productPricingInformation] = pricingInfo;
    Object.keys(Fields).forEach(key=>{
        newProduct[key] = Fields[key]
    })
    await newProduct.save();
    res.json({message: 'Product created'})

})

router.post('/addtocart', async (req, res)=>{
    const userId = req.params.id;
    const cart = Cart.findOne({Owner: userId})
    if(!cart) throw new Error('there is such cart')
    await cart.Products.unshift()
})

router.get(`/search`, async (req, res)=>{
    const searchTerm = req.searcnh_term;
    const matchedProrducts = Search(searchTerm);
    res.json({matchedProrducts}) // send them to the client
})

const webhookSecret =  'whsec_2070e1acbbb65c3682459b74cb365c4be1b357fc653bf52f2cc793cfb648b4e3'

router.get('/category', async(req, res)=>{
    const categoryName = req.category_name;
    const products = await Product.find({productCategory : categoryName});
    res.send({products})
})

router.post('/generate', generate)

router.post('/webhook', async(req, res)=>{
    console.log('reach out here in webhooks');
    const event =  req.body.type;
    switch(event){
        case 'payment_intent.succeeded':
            console.log('payment intent became successful here');
            const payment_method_options = req.body.data;
            break;
        case 'checkout.session.async_payment_succeeded':
            const amoutToSend =  req.body.data.amount_recieved * (1-ourPercentage); // here we have got the amount of money to send when succeded .... we can create pending a new Transaction again for the person who sold the product, and then say that it is stil pending, and then when the buyer of hte product confirms that the product is reciecved, then we can set that transaction to active, and then send the monent to the user. 
            const product =  await Product.findById(req.body.data.productId)
            break;
        case 'checkout.session.completed':
            const checkoutId = req.body.data.object.id;
            const session = await stripe.checkout.sessions.retrieve(checkoutId, {expand : ['customer']});
            console.log(session);
            break;
        default:
            return null;
    }
})


router.post('/create-payment-session', stripeFunction);

router.get('/sign-s3', getS3Url)
export default router; 