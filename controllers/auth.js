import { body, matchedData, validationResult } from "express-validator";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

function renderSignUp(req, res){
    res.render("signup", {errors : null});
}

const validateAndCreateUser = [[
    body("username").trim()
    .isLength({min : 5, max : 20}).withMessage("Username should contain 5 to 20 characters")
    .custom(async value => {
        const user = await prisma.user.findUnique({
            where : { username :  value }
        })
        if(user){
            throw new Error("Username already exists")
        }
        return true;
    }),
    body("password").trim()
    .isLength({min : 5, max : 20}).withMessage("Passwords should contain 5 to 20 characters"),
    body("confirmpassword").trim()
    .custom(async (value, {req}) => {
        if(value != req.body.password){
            throw new Error("Passwords should match");
        }
        return true;
    })
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).render("signup", {errors : errors.array()})
    }
    const { username , password } = matchedData(req);
    const hashedPass = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data : {
            password : hashedPass,
            username : username
        }
    })
    res.redirect('/');
}]

export {
    renderSignUp,
    validateAndCreateUser
}