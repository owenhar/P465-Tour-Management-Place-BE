const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
    restaurantID: {
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
}, { timestamps: true });

module.exports = mongoose.model("Restaurant", restaurantSchema);