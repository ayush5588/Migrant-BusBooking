const busSchema = require('../../transport/bus/schema');
const userSchema = require('../login-signup/schema');
const shortid = require('shortid');

exports.busBooking = (req,res)=>{
    const source = req.body.source;
    const dest = req.body.destination;
    const travelDate = req.body.travelDate;
    const uid = req.session.user;

    userSchema.findOne({uid: uid}).then((migrant)=>{
        const migrant_id = migrant.aadharUid;
        busSchema.find({source: source,destination: dest,travelDate: travelDate}).then((busData)=>{
            if(busData[0].seatAvailable>0){
                const updatedTicketCount = busData[0].seatAvailable - 1;
                busSchema.findOneAndUpdate({source: source,destination: dest,travelDate: travelDate},{$push: {passengerList: migrant_id}}).then((data)=>{
                    busSchema.findOneAndUpdate({source: source,destination: dest,travelDate: travelDate},{$set: {seatAvailable: updatedTicketCount}}).then((data)=>{
                        busSchema.findOne({source: source,destination: dest,travelDate: travelDate}).then((data)=>{
                            req.flash('info','Your ticket has been booked');
                            res.locals.message = req.flash();
                            res.render('busBooking');
                        }).catch((e)=>{
                            console.log(`Error - ${e}`);
                            req.flash('info','Your ticket has been booked but we are experiencing some trouble.Please try again later');
                            res.locals.message = req.flash();
                            res.render('busBooking');
                        })
                    }).catch((e)=>{
                        console.log(`Error - ${e}`);
                        req.flash('info','Please try again later');
                        res.locals.message = req.flash();
                        res.render('busBooking');
                    });
            
            
        }).catch((e)=>{
            console.log(`Error - ${e}`);
            req.flash('info','Please try again later');
            res.locals.message = req.flash();
            res.render('busBooking');
        })
            }else{
                req.flash('info','Seats are full.No ticket bookings allowed');
                res.locals.message = req.flash();
                res.render('busBooking');
            }
        }).catch((e)=>{
            console.log(`Error - ${e}`);
            req.flash('info','Please try again later');
            res.locals.message = req.flash();
            res.render('busBooking');
        });
            
    }).catch((e)=>{
        console.log(`Error occured in finding migrant in userSchema -> ${e}`);
        req.flash('info','Please try again later');
        res.locals.message = req.flash();
        res.render('busBooking');
    });

    

}