import passport from "passport";
import LocalStrategy from 'passport-local'
import { Strategy as ExtractJwt, JwtStrategy } from "passport-jwt";
import User from "../models/user";
import dotenv from 'dotenv'
dotenv.config({silent: true})
const AUTH_KEY = process.env.AUTH_KEY;


const localOptions = {usernamefield: 'email'};
const jwtOptions = {
    jwtFromHeader : ExtractJwt.jwtFromHeader('auth_token'),
    secretOrKey : AUTH_KEY
}

const LocalLogin = new LocalStrategy(localOptions, async (email, passowrd, done)=>{
    let user;
    let passowrdMathes ;
    try {
        user = await User.findOne({Email: email});
        if(!user) return done(null, false)
        passowrdMathes = await User.comparePasswords(passowrd);
        if(!passowrdMathes) return done(null, false)
        return done(null, true);
    } catch (error) {
        console.log(error.message);
    }
})

const jwtAuthentication = new JwtStrategy(jwtOptions, async (payload, done)=>{
    let user;
    try {
        user = await User.findById(payload.sub);
        if(!user) return done(null, false);
        return done(null, true)
    } catch (error) {
        console.log(error.message);
    }
})


passport.use(LocalLogin);
passport.use(jwtAuthentication)


export const requireLogin = passport.authenticate('local', {session: false}) 
export const reqruireAuthentication = passport.authenticate('jwt', {session: false});