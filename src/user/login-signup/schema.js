const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: {type: String,unique: true,required: true},
    aadharUid: {type: String,unique: true,required: true},
    password: {type: String,unique: true,required: true},
    status: {type: String,required: true}
},{timestamps: true});

module.exports = mongoose.model('userSchema',userSchema);