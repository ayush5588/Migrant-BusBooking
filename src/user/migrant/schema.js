const mongoose = require('mongoose');

const migrantSchema = new mongoose.Schema({
    uid: {type: String,unique: true,required: true},
    aadharUid: {type: String,unique: true,required: true},
},{timestamps: true});

module.exports = mongoose.model('migrantSchema',migrantSchema);