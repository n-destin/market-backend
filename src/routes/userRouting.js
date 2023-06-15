import { Router } from "express";

const router =  Router();

router.post('/singup', async(req, res)=>{
    console.log('reacheed in the routes');
    const user = req.body;
})

