const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    pictureURL: {
        type: String,
        default: ""
    },
    placeID: {
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
    restaurants: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Restaurant'
    }],
    hotels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel'
    }],
    flights: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight'
    }],
    thingsToDo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ThingsToDo'
    }],
    searchTags: [String],
}, { timestamps: true });


module.exports = mongoose.model("Place", placeSchema);
