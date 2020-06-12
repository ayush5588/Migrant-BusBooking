const shortid = require('shortid');
const busSchema = require('../../transport/bus/schema');

exports.addBus = (req,res)=>{
    const source = req.body.source;
    const dest = req.body.dest;
    const seatAva = req.body.seatAvailable;
    const travelDate = req.body.date;
    const newBus = new busSchema({
        uid: shortid.generate(),
        source: source,
        destination: dest,
        seatAvailable: seatAva,
        travelDate: travelDate
    });
    newBus.save().then(()=>{
        console.log('New bus data added');
        req.flash('info','New Bus data added');
        res.locals.message = req.flash();
        res.render('addBus');
    }).catch((e)=>{
        console.log(`Error in saving Bus data`);
        req.flash('info','Error in saving the data.Please try again later');
        res.locals.message = req.flash();
        res.render('addBus');
    });
}

exports.downloadBusData = (req,res)=>{
    const source = req.body.source;
    const dest = req.body.destination;
    const travelDate = req.body.travelDate;
    busSchema.find({source: source,destination: dest,travelDate: travelDate}).then((data)=>{
        res.json({data});
    }).catch((e)=>{
        console.log(`Error in getting the data from the bus db - ${e}`);
        req.flash('info','Error in getting the data.Please try again later');
        res.locals.message = req.flash();
        res.render('downloadBusData');
    });
}