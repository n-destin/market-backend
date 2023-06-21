import User from "../models/user";
import { Router } from "express";
import { singIn, singupUser } from "../conrollers/userControllers";
import {requireAuth, requireLogin} from '../services/passport'
const router =  Router();


router.get('/', async (req, res)=>{
    res.json("If you are reading this message, it means that I hacked your computer")
})
router.post('/signup', async (req, res)=>{
    console.log('reached in the routes');
    const userInfo = req.body;
    const Fields = userInfo.userInfo;
    try {
       const Token =  await singupUser(userInfo);
       res.json({UserToken : Token, authKey : process.env.AUTH_KEY});
    } catch (error) {
        console.log(error.message);
    }
})


router.post('/signin',requireLogin, async (req, res)=>{
    console.log('reached in the login');
    const Token = singIn(req.body);
    res.json({UserToken: Token});
})

router.post('/posting', async (req, res)=>{
    res.json({message : 'this is a response'})
})

export default router;
