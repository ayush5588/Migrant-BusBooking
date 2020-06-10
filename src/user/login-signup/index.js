const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.route('/login').get(controller.session_Checker,(req,res)=>{res.render('login')}).post(controller.login);
router.route('/signup').get(controller.session_Checker,(req,res)=>{res.render('signup')}).post(controller.signup);

module.exports = router;