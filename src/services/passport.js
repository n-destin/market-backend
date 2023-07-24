import passport from "passport";
import LocalStrategy from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/user";
import dotenv from 'dotenv'
import GoogleStrategy from 'passport-google-oauth2'
dotenv.config({silent: true})

// const AUTH_KEY = process.env.AUTH_KEY

const localOptions = {usernameField: 'Email', passwordField: 'Password'};
const AUTH_KEY = 'niyomufashadestintuyizerehonore'


const jwtOptions ={
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey : AUTH_KEY 
}

const LocalLogin = new LocalStrategy(localOptions, async (Email, Password, done)=>{
    console.log('reached in local strategy');
    let user;
    let passowrdMathes;
    try {
        user = await User.findOne({Email});
        if(!user) return done(null, false)
        passowrdMathes = await user.comparePasswords(Password);
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
        return done(null, error);
    }
})


passport.use(LocalLogin);
passport.use(jwtAuthentication)
// passport.use(new GoogleStrategy(
    
// ))


export const requireLogin = passport.authenticate('local', {session: false}) 
export const requireAuthentication = passport.authenticate('jwt', {session: false});