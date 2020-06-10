const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    uid: {type: String,unique: true,required: true},
    areaAssigned: {type: String,required: true}
},{timestamps: true}); 

module.exports = mongoose.model('adminSchema',adminSchema);