const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    uid: {type: String,unique: true},
    source: {type: String,required: true},
    destination: {type: String,required: true},
    seatAvailable: {type: Number,required: true},
    passengerList: [{type: String,unique: true}],
    travelDate: {type: Date}
});

module.exports = mongoose.model('busSchema',busSchema);
    