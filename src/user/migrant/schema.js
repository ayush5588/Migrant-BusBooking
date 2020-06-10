const mongoose = require('mongoose');

const migrantSchema = new mongoose.Schema({
    uid: {type: String,unique: true,required: true},
    aadharUid: {type: String,unique: true,required: true},
    totalPassengers: {type: String},
    passengersAadhar: [{type: String,unique: true}],
},{timestamps: true});

module.exports = mongoose.model('migrantSchema',migrantSchema);