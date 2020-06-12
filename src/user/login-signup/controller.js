const bcrypt = require('bcrypt');
const saltRounds = 5;
const shortid = require('shortid');
const sanitize = require('sanitize-html');
const session = require('express-session');
//const flash = require('connect-flash');

const migrantSchema = require('../migrant/schema');
const adminSchema = require('../admin/schema');
const userSchema = require('./schema');

// signup only for migrants 
exports.signup = (req,res)=>{
    const uid = shortid.generate();
    const aadharUid = sanitize(req.body.aadharUid,{allowedAttributes:{},allowedTags: []});
    const password = sanitize(req.body.password,{allowedAttributes:{},allowedTags: []});

    if(aadharUid && password){  
        userSchema.findOne({aadharUid: aadharUid}).then((data)=>{
            if(data){
                // User already exists
                req.flash('info','User already exists');
                res.locals.message = req.flash();
                res.render('signup');
            }else{
                bcrypt.hash(password,saltRounds).then((hashedPassword)=>{
                    const user = new userSchema({
                        uid: uid,
                        aadharUid: aadharUid,
                        password: hashedPassword,
                        status: 'Migrant'
                    });
                    user.save().then(()=>{
                        console.log('User successfully signed up');
                        req.flash('info','User successfully signed up');
                        res.locals.message = req.flash();
                        res.render('signup');
                    }).catch((e)=>{
                        console.log(`error in signing up - ${e}`);
                        req.flash('info','Some error occured.Please try later');
                        res.locals.message = req.flash();
                        res.render('signup');
                    });
                }).catch((e)=>{
                    console.log(`error in signing up - ${e}`);
                    req.flash('info','Some error occured.Please try later');
                    res.locals.message = req.flash();
                    res.render('signup');
                })
            }
        }).catch((e)=>{
            console.log(`Error occured while searching in the db - ${e}`);
            req.flash('info','Some error occured.Please try later');
            res.locals.message = req.flash();
            res.render('signup');
        })
        
    }else{
        const m = '';
        if(!aadharUid){
            m = 'Aadhar number is not provided';
        }else if(!password){
            m = 'Password not provided';
        }else{
            m = 'No information is provided';
        }
        req.flash('info',m);
        res.locals.message = req.flash();
        res.render('signup');
    }
}

exports.login = (req,res)=>{
    const aadharId = req.body.aadharId;
    const password = req.body.password;
    const status = req.body.status;
    userSchema.findOne({aadharUid: aadharId}).then((data)=>{
        if(data){
            const hashedPassword = data.password;
            bcrypt.compare(password,hashedPassword).then((result)=>{
                if(result == true){
                    if(data.status == status){
                        if(status == 'Admin'){
                            // Admin
                            req.session.user = data.uid;
                            req.session.loggedIn = true;
                            console.log('User logged in');
                            res.render('adminDataView');
                        }else{
                            // Migrant
                            req.session.user = data.uid;
                            console.log('User logged in');
                            res.render('busBooking');
                        }
                    }else{
                        console.log('Not Authorized');
                        req.flash('info','Not Authorized');
                        res.locals.message = req.flash();
                        res.render('login');
                    }
                    
                    //res.redirect('/user/dashboard');
                }else{
                    console.log('Incorrect Password');
                    req.flash('info','Incorrect Password');
                    res.locals.message = req.flash();
                    res.render('login');
                }
            }).catch((e)=>{
                console.log(`Error in comparing the passwords - ${e}`);
                req.flash('info','some error occured.Please try later');
                res.locals.message = req.flash();
                res.render('login');
            })
        }else{
            console.log('User does not exist');
            req.flash('info','User does not exist');
            res.locals.message = req.flash();
            res.render('login');
        }
    }).catch((e)=>{
        console.log(`Error in viewing migrant db in login route - ${e}`);
        req.flash('info','some error occured.Please try later');
        res.locals.message = req.flash();
        res.render('login');
    })
}

exports.session_Checker = (req,res,next)=>{
    if(req.session.loggedIn && req.cookie.user_key){
        res.redirect('/user/dashboard');
    }else{
        next();
    }
}

exports.logout = (req,res)=>{
    req.session.loggedIn = false;
    req.session.destroy();
    res.clearCookie('user_key');
    res.redirect('/');
}