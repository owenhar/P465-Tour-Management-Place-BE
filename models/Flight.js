const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
    flightID: {
        type: String,
        unique: true,
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
    favorited: {
        type: String,
        default: "No"
    },
}, { timestamps: true });

module.exports = mongoose.model("Flight", flightSchema);