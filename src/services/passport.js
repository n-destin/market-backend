import passport from "passport";
import LocalStrategy from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/user";
import dotenv from 'dotenv'
import GoogleStrategy from 'passport-google-oauth2'
dotenv.config({silent: true})


const localOptions = {usernameField: 'Email', passwordField: 'Password'};

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey : process.env.AUTH_KEY
}

export const middlewareTest =(req)=>{
    console.log('reached in the testing miffleware');
    console.log(jwtOptions.jwtFromRequest(req));
    return (null, true);
}

const LocalLogin = new LocalStrategy(localOptions, async (Email, Password, done)=>{
    let user;
    let passowrdMathes;
    try {
        user = await User.findOne({Email});
        if(!user) console.log('no user!');
        if(!user) return done(null, false)
        console.log(Password)
        passowrdMathes = await user.comparePasswords(Password);
        if(!passowrdMathes) console.log('no password match!');
        if(!passowrdMathes) return done(null, false)
        return done(null, true);
    } catch (error) {
        console.log('oops');
        console.log(error.message);
    }
})

const jwtAuthentication = new JwtStrategy(jwtOptions, async (payload, done)=>{
    console.log('reached in jwt strategy');
    let user;
    try {
        user = await User.findById(payload.sub);
        if(!user) return done(null, false);
        return done(null, user)
    } catch (error) {
        console.log(error.message);
        return done(null, error);
    }
})



passport.use(LocalLogin);
passport.use(jwtAuthentication)

export const requireLogin = passport.authenticate('local', {session: false}) 
export const requireAuthorization = passport.authenticate('jwt', {session: false});