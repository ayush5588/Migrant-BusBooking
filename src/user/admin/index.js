const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.route('/add/bus').get((req,res)=>{res.render('addBus')}).post(controller.addBus);
router.route('/busData/download').get((req,res)=>{res.render('downloadBusData')}).post(controller.downloadBusData);

module.exports = router;