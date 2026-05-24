const nodemailer =
require('nodemailer');

const express =
require('express');

const mongoose =
require('mongoose');

const cors =
require('cors');

const Booking =
require('./models/Booking');

const app = express();

/* EMAIL TRANSPORTER */

const transporter =
nodemailer.createTransport({

    service:'gmail',

    auth:{

        user:'denimsalon03@gmail.com',

        pass:'grrw movy qxvt pnmo'

    }

});

/* MIDDLEWARE */

app.use(cors());

app.use(express.json());

/* MONGODB CONNECTION */

mongoose.connect(

'mongodb://127.0.0.1:27017/denimSalon'

)

.then(()=>{

    console.log(
    'MongoDB Connected'
    );

})

.catch((err)=>{

    console.log(err);

});

/* TEST ROUTE */

app.get('/', (req,res)=>{

    res.send('Backend Running');

});

/* BOOK APPOINTMENT */

app.post('/book', async(req,res)=>{

    try{

        const booking =
        new Booking(req.body);

        await booking.save();

        /* SEND BOOKING RECEIVED EMAIL */

        await transporter.sendMail({

            from:'denimsalon03@gmail.com',

            to:req.body.email,

            subject:'Appointment Request Received',

            html:`

            <h2 style="color:gold;">
            Denim Hair Salon
            </h2>

            <p>
            Your appointment request
            has been received successfully.
            </p>

            <p>
            Please wait until admin
            confirms your booking.
            </p>

            <h3>
            Booking Details
            </h3>

            <p>
            <b>Service:</b>
            ${req.body.service}
            </p>

            <p>
            <b>Date:</b>
            ${req.body.date}
            </p>

            <p>
            <b>Time:</b>
            ${req.body.time}
            </p>

            `

        });

        res.json({

            success:true,

            message:
            'Appointment Booked Successfully'

        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

});

/* GET ALL BOOKINGS */

app.get('/allBookings', async(req,res)=>{

    try{

        const bookings =
        await Booking.find();

        res.json(bookings);

    }

    catch(error){

        res.status(500).json({

            error:error.message

        });

    }

});

/* DELETE BOOKING */

app.delete('/deleteBooking/:id',

async(req,res)=>{

    try{

        await Booking.findByIdAndDelete(

            req.params.id

        );

        res.json({

            message:'Booking Deleted'

        });

    }

    catch(error){

        res.status(500).json({

            error:error.message

        });

    }

});

/* UPDATE STATUS */

app.put('/updateStatus/:id',

async(req,res)=>{

    try{

        const booking =
        await Booking.findByIdAndUpdate(

            req.params.id,

            {

                status:req.body.status

            },

            {

                new:true

            }

        );

        /* SEND APPROVED EMAIL */

        if(req.body.status === 'Approved'){

            await transporter.sendMail({

                from:'denimsalon03@gmail.com',

                to:booking.email,

                subject:'Booking Confirmed',

                html:`

                <h2 style="color:green;">
                Denim Hair Salon
                </h2>

                <h3>
                Your Booking Is Confirmed
                </h3>

                <p>
                Dear Customer,
                </p>

                <p>
                Your appointment has been
                approved successfully.
                </p>

                <h3>
                Appointment Details
                </h3>

                <p>
                <b>Service:</b>
                ${booking.service}
                </p>

                <p>
                <b>Date:</b>
                ${booking.date}
                </p>

                <p>
                <b>Time:</b>
                ${booking.time}
                </p>

                <p>
                Thank you for choosing
                Denim Hair Salon.
                </p>

                `

            });

        }

        /* SEND REJECTED EMAIL */

        if(req.body.status === 'Rejected'){

            await transporter.sendMail({

                from:'denimsalon03@gmail.com',

                to:booking.email,

                subject:'Booking Rejected',

                html:`

                <h2 style="color:red;">
                Denim Hair Salon
                </h2>

                <h3>
                Appointment Rejected
                </h3>

                <p>
                Dear Customer,
                </p>

                <p>
                Unfortunately your
                appointment request
                could not be approved.
                </p>

                <p>
                Please select another
                date or time slot.
                </p>

                `

            });

        }

        res.json({

            message:'Status Updated'

        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            error:error.message

        });

    }

});

/* CHECK DATE AVAILABILITY */

app.get('/checkAvailability/:date',

async(req,res)=>{

    try{

        const selectedDate =
        req.params.date;

        const bookings =
        await Booking.find({

            date:selectedDate

        });

        const bookedCount =
        bookings.length;

        const available =
        bookedCount < 15;

        const bookedSlots =
        bookings.map(

            booking => booking.time

        );

        res.json({

            bookedCount,

            available,

            bookedSlots

        });

    }

    catch(error){

        res.status(500).json({

            error:error.message

        });

    }

});

/* SERVER */

app.listen(5000, ()=>{

    console.log(
    'Server Running On Port 5000'
    );

});