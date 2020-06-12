const busSchema = require('../../transport/bus/schema');
const userSchema = require('../login-signup/schema');
const shortid = require('shortid');

exports.busBooking = (req,res)=>{
    const source = req.body.source;
    const dest = req.body.destination;
    const travelDate = req.body.travelDate;
    const uid = req.session.user;

    userSchema.findOne({uid: uid}).then((migrant)=>{
        const migrant_id = migrant._id;
        busSchema.findOneAndUpdate({source: source,destination: dest,travelDate: travelDate},{$push: {passengerList: migrant_id}}).then((data)=>{
            busSchema.find({source: source,destination: dest,travelDate: travelDate}).then((busData)=>{
                //res.send(busData);
                // Display that the ticket has been successfully booked
            }).catch((e)=>{
                //res.send(e);
            })
        }).catch((e)=>{
            res.send(e);
        })
    }).catch((e)=>{
        console.log(`Error occured in finding migrant in userSchema -> ${e}`);
    });

    

}