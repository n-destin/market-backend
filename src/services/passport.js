import passport from "passport";
import LocalStrategy from 'passport-local'
import { Strategy as ExtractJwt, jwtStrategy } from "passport-jwt";
import User from "../models/user";


const localOptions = {usernamefield: 'email'};
const jwtOptions = {
    jwtFromHeader : ExtractJwt.FromHeader('auth_token')
}

const LocalStrategy = new LocalStrategy(localOptions, async (email, passowrd, done)=>{
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

const jwtStrategy = new jwtStrategy(jwtOptions, (payload, done)=>{
    let user;
    try {
        user = await User.findById(payload.sub);
        if(!user) return done(null, false);
        return done(null, true)
    } catch (error) {
        console.log(error.message);
    }
})


passport.use(LocalStrategy);
passport.use(jwtStrategy)


export const requireLogin = passport.authenticate('local', {session: false}) 
export const reqruireAuthentication = passport.authenticate('jwt', {session: false});