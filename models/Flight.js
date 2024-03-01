const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
    flightID: {
        type: String,
        unique: true,
        required: true
    },
    toLocation: {
        type: String,
        required: true
    },
    fromLocation: {
        type: String,
        required: true
    },
    miles: {
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
}, { timestamps: true });

module.exports = mongoose.model("Flight", flightSchema);