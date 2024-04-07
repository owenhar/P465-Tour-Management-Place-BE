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
    latitude:{
        type: Number,
        default: 0
    },
    longitude:{
        type: Number,
        default: 0
    },
    pictureURL: {
        type: String,
        validate: {
            validator: function(v) {
                if (!/^(ftp|http|https):\/\/[^ "]+$/.test(v)) {
                    throw new Error("PictureURL format is incorrect");
                }
                return true;
            }
        },
        default: ""
    },
    placeID: {
        type: String,
        unique: true,
        required: true
    },
    description: String,
    favorited: {
        type: Boolean,
        default: false
    },
    price : Number,
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
