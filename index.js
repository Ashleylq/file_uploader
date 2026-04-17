import express from "express";
import session from "express-session";
import path from "node:path";
import passportConfig from "./util/passportConfig.js";
import passport from "passport";
import { prisma } from "./lib/prisma.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import "dotenv/config";
import authRouter from "./routers/authRouter.js";
import folderRouter from "./routers/folderRouter.js";
const __dirname = import.meta.dirname ;

const app = express();

passportConfig(passport);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false,
    cookie : {
        maxAge : 1000 * 60 * 60 * 24
    },
    store : new PrismaSessionStore(prisma, {
        checkPeriod: 2 * 60 * 1000,  
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined
    })
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended : false}));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})
app.use(express.static(path.join(__dirname, "public")));

app.use('/', authRouter);
app.use('/folder', folderRouter);

app.listen(3000, (err) => {
    if(err){
        throw(err);
    }
})

