import { response, Router } from "express";
import User from "../models/user";
import { singupUser } from "../conrollers/userControllers";
import { requireLogin } from "../services/passport";

const router =  Router();

router.post('/singup', async(req, res)=>{
    console.log('reacheed in the routes');
    const userInfo = req.body;
    try {
       const response =  await singupUser(userInfo);
    } catch (error) {
        console.log(error.message);
    }
    res.json(response);
})


router.post('/login', requireLogin, async (req, res)=>{
    const userFields = req.body;
})
