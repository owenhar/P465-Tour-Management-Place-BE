const mongoose = require("mongoose");

const thingsToDoSchema = new mongoose.Schema({
    thingsToDoID: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectID,
        ref:'Place',
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        default: 0
    },
    description: String,
    favorited: {
        type: String,
        default: "No"
    },
    ratings: {
        type: Number,
        default: 0
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    startTime: {
        type: String,
    },
    maxGuests: {
        type: Number,
        default:10
    },
    classType: {
        type: String,
        default:""
    },
    type: {
        type: String,
        default: ""
    },
    date:{
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("ThingsToDo", thingsToDoSchema);