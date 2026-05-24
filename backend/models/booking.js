const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    service:{
        type:String,
        required:true
    },

    message:{
        type:String
    },

    date:{
        type:String,
        required:true
    },

    time:{
        type:String,
        required:true
    },

    status:{
        type:String,
        default:'Pending'
    }

});

module.exports = mongoose.model(
    'Booking',
    bookingSchema
);