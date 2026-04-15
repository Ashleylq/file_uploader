import { Strategy } from "passport-local";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

export default (passport) => {
    passport.use(new Strategy(async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({
                where : { username : username }
            })
            if(!user){
                return done(null, false, {message : "Incorrect Username"});
            }
            const match = await bcrypt.compare(password, user.password)
            if(!match){
                return done(null, false, {message : "Incorrect Password"});
            }
            return done(null, user);
        }
        catch(err){
            return done(err)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await prisma.user.findUnique({
                where : { id : id }
            })
            done(null, user)
        }
        catch(err){
            done(err)
        }
    })
}
