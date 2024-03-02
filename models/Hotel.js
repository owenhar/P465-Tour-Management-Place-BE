const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
    hotelID: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    pictureURL: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        default: 0
    },
    description: String,
    ratings: {
        type: Number,
        default: 0
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
}, { timestamps: true });

module.exports = mongoose.model("Hotel", hotelSchema);