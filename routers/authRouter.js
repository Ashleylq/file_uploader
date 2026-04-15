import { Router } from "express";
import { renderSignUp, validateAndCreateUser } from "../controllers/auth.js";

const authRouter = Router();

authRouter.get('/', (req, res) => {
    if(!req.isAuthenticated()){
        renderSignUp(req, res);
    }
})

authRouter.get('/signup', (req, res) => {
    renderSignUp(req, res);
})

authRouter.post('/signup', validateAndCreateUser);


export { authRouter };