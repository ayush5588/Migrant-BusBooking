const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.route('/busInfo').get((req,res)=>{res.render('busBooking')}).post(controller.getBusInfo);
router.route('/bookTickets').post(controller.busBooking);
module.exports = router;