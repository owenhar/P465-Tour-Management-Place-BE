const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectID,
        ref:'Place',
        required: true
    },
    pictureURL: {
        type: String,
        default: ""
    },
    hotelImagesURL: [{
        type: String,
        default: []
    }],
    price: {
        type: Number,
        default: 0
    },
    hotelID: {
        type: String,
        unique: true,
        required: true
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
    amenities: {
        type: [String], 
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model("Hotel", hotelSchema);