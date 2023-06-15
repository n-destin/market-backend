import User from "../models/user";
import { Router } from "express";
import { singIn, singupUser } from "../conrollers/userControllers";
import { requireLogin } from "../services/passport";
import { generateToken } from "../conrollers/userControllers";
const router =  Router();



router.post('/singup', async(req, res)=>{
    console.log('reached in the routes');
    const userInfo = req.body;
    try {
       const Token =  await singupUser(userInfo);
       res.json({UserToken : Token, authKey : process.env.AUTH_KEY});
    } catch (error) {
        console.log(error.message);
    }
})


router.post('/login', requireLogin, async (req, res)=>{
    const Token = singIn(req.body);
    res.json({UserToken: Token});
})

export default router;
