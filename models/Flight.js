const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
    flightID: {
        type: String,
        unique: true,
        required: true
    },
    airline: {
        type: String,
        required: true
    },
    flightNumber: {
        type: String,
        required: true
    },
    source: {
        type: mongoose.Schema.Types.ObjectID,
        ref:'Place',
        required: true
    },
    destination: {
        type: mongoose.Schema.Types.ObjectID,
        ref:'Place',
        required: true
    },
    departureTime: {
        type: String,
        required: true
    },
    arrivalTime: {
        type: String,
        required: true
    },
    classType:{
        type: String,
        required:true
    },
    miles: {
        type: Number,
    },
    duration:{
        type: Number,
    },
    stops:{
        type: Number,
    },
    pricePerMile: {
        type: Number, 
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    favorited: {
        type: String,
        default: "No"
    },
    image:{
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("Flight", flightSchema);