import { Router } from "express";
import { renderLogin, renderSignUp, validateAndCreateUser } from "../controllers/auth.js";
import passport from "passport";
import { renderFolders } from "../controllers/folder.js";

const authRouter = Router();

authRouter.get('/', async (req, res) => {
    if(!req.isAuthenticated()){
        renderLogin(req, res);
    }
    else {
        await renderFolders(req, res);
    }
})

authRouter.get('/signup', (req, res) => {
    renderSignUp(req, res);
})

authRouter.post('/signup', validateAndCreateUser);

authRouter.get('/login', (req, res) => {
    renderLogin(req, res);
})

authRouter.post('/login', passport.authenticate("local", {
    successRedirect : '/',
    failureRedirect : '/login',
    failureMessage : true
}))

authRouter.get('/logout', (req, res) => {
    req.logout((err) => {
        if(err){
            throw(err);
        }
    });
    res.redirect('/');
})

export default authRouter ;