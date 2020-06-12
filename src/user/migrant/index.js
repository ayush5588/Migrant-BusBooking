const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.route('/bookTickets').get((req,res)=>{res.render('busBooking')}).post(controller.busBooking);

module.exports = router;