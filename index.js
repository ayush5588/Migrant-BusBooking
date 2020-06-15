const express = require('express');
const CookieParser = require('cookie-parser');
const flash = require('connect-flash');
const logger = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
require('dotenv/config');

const SessionStore = new session.MemoryStore;
app.use(session({
    cookie: {maxAge: 60000},
    saveUninitialized: false,
    key:'user_key',
    secret: process.env.SESSION_SECRET,
    store: SessionStore,
    resave: false
}));
app.use(logger('dev'));    // for logs
app.use(express.json());   // Parsing the json 
app.use(CookieParser());   // cookie parser
app.use(express.urlencoded({extended: true}));  // allows to post nested object eg. {person: {name: 'ayush'}}
app.use(flash());
app.set('view engine','ejs');  // setting the view engine to ejs

app.use((req,res,next)=>{  // for removing the flash message after displaying it. 
    res.locals.removeMessage = ()=>{   // removeMessage will be accessible globally
        req.session.message = [];
    }
    next();
});

app.use((req,res,next)=>{  // for cases when the cookie remains in the user browser even if the user logged out
    if(req.cookies.user_key && !req.session.user){
        res.clearCookie('user_key');
    }
    next();
});

//Routes

const userAuth = require('./src/user/login-signup/index');
const adminUser = require('./src/user/admin/index');
const migrantUser = require('./src/user/migrant/index');

app.use('/user',userAuth);
app.use('/admin',adminUser);
app.use('/migrant',migrantUser);

app.get('/',(req,res)=>{
    res.render('home');
});

// server and db connection
const PORT = process.env.PORT || 8080;
const url = process.env.DB_URL;
mongoose.connect(url,{useUnifiedTopology: true,useNewUrlParser: true,useFindAndModify: false},(e)=>{
    if(e){
        console.log(`Error in connecting to db - ${e}`);
    }else{
        console.log(`db connected`);
        app.listen(PORT,(err)=>{
            if(err){
                res.status(404).json({code: 0,message: `Error in connecting to the server`});
            }else{
                console.log(`Server started at ${PORT}`);
            }
        });
    }
});

// To comment at once -> ctrl + k + c
// To uncomment at once -> ctrl + k + u