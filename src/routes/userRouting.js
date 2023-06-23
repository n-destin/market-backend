import User from "../models/user";
import { Router } from "express";
import { signIn, singupUser } from "../conrollers/userControllers";
import {requireAuthentication, requireLogin} from '../services/passport'
import  Product  from "../models/product";
import dotenv from 'dotenv'
import * as productFunction from '../conrollers/proudctControllers'
dotenv.config({silent : true})
const router =  Router();


router.get('/', async (req, res)=>{
    res.json("If you are reading this message, it means that I hacked your computer")
})
router.post('/signup', async (req, res)=>{
    console.log('reached in the routes');
    const userInfo = req.body;
    const Fields = userInfo.userInfo;
    try {
       const Token =  await singupUser(Fields);
       res.json({UserToken : Token, authKey : process.env.AUTH_KEY});
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

router.get('/products', async ( req, res)=>{
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


router.post('/createProduct', async (req, res)=>{
    console.log('reached in the backend creating');
    const newProduct = new Product;
    const id = req.body.id;
    newProduct.Owner = id;
    const Fields = req.body;
    console.log(Fields);
    Object.keys(Fields).forEach(key=>{
        newProduct[key] = Fields[key]
    })

    await newProduct.save();
    res.json({message: 'Product created'})

})

export default router;
