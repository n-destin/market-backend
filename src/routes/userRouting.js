import User from "../models/user";
import { Router } from "express";
import { signIn, singupUser } from "../conrollers/userControllers";
import {requireAuthentication, requireLogin} from '../services/passport'
import getS3Url from '../services/amazon'
import  Product  from "../models/product";
import dotenv from 'dotenv'
import * as productFunction from '../conrollers/proudctControllers'
import { Cart } from "../models/cart";
import Search from '../conrollers/proudctControllers'
import {stripeFunction} from '../services/payment'
import Stripe from "stripe";
import {generate} from '../services/gpt'
import Transaction from "../models/Transaction";
import {paymentStatus} from '../models/Transaction'

dotenv.config({silent:true});
const STRIPE_URL = 'https://api.stripe.com/v1'

const ourPercentage = .24;
dotenv.config({silent : true})
const router =  Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
router.get('/', async (req, res)=>{
    res.json("If you are reading this message, it means that I hacked your computer")
})
router.post('/signup', async (req, res)=>{
    const userInfo = req.body;
    const userId = Date.now()
    const Fields = userInfo.userInfo;
    try {
        const userEmail = Fields.Email;
        // make verifications
       const Token =  await singupUser(Fields);
       const userInfoForFrontEnd = {firstName : Fields.firstName, lastName : Fields.lastName, userEmail: Fields.Email, phoneNumber : Fields.phoneNumber}
       console.log(userInfoForFrontEnd);
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

// router.post('/addtocart',requireAuthentication, (req,res)=> { req.user }) // get them here 

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
    newProduct[priceId] = pricingInfo.priceId;
    newProduct[productId] = pricingInfo.productId;
    Object.keys(Fields).forEach(key=>{
        newProduct[key] = Fields[key]
    })
    await newProduct.save();
    res.json({message: 'Product created'})

})

router.post('/addtocart', requireAuthentication, async (req, res)=>{
    console.log('adding to card');
    const userId = req.user;
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

router.post('/generate', generate);

router.post('/confirm-receipt', requireAuthentication, (req, res)=>{
    const transaction = Transaction.findById(req.transactionId);
    transaction.paymentStatus = paymentStatus.PAID_AND_RECIEVED;
    const sellerid = transaction.Seller;
    // send the money to the user's account
    const stripeaccountid = User.findById(sellerid).stripeaccountid;
    const paymentLink = stripe.paymentLink.create({
        account :  stripeaccountid,
        return_url : 'http://localhost:5173/',
        reauthenticate_url : 'http://localhost:5173/authenticate',
        type : 'account_onboarding'
    })

    res.json({paymentLink})
})

router.post('/webhook', requireAuthentication, async(req, res)=>{
    console.log('reach out here in webhooks');
    const event =  req.body.type;
    switch(event){
        // other cases are not done
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
            stripe.checkout.sessions.listLineItems(checkoutId, (error, lineItems)=>{
                if(lineItems){
                    lineItems.data.map(line_item=>{
                        // find the product whose paymet information matches this, and then the associated owner, and then craete a pending transaction between that person and the owner, and the amout she should recieve
                        const Seller =  Product.find({priceId : line_item.price}).then(product=>{
                            const seller = product.Seller;
                            const newTransaction  = new Transaction();
                            newTransaction[product] = product._id;
                            newTransaction[TransactionType] = product.Purpose,
                            newTransaction[Buyer] = req.user,
                            newTransaction[Seller] = seller,
                            newTransaction[TransactionAmout] = line_item.amount_total,
                            newTransaction[TransactionTime] = Date.now();
                            newTransaction[amount_seller] = (1-ourPercentage) * lineItems.amount_total;
                            newTransaction.save();
                        })
                    })
                }
            })
        default:
            return null;
    }
})


router.post('/create-payment-session', stripeFunction);

router.get('/sign-s3', getS3Url)
export default router; 