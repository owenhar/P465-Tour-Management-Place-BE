const mongoose = require("mongoose");

const placeScheme = new mongoose.Schema({
    name: String,
    city: String,
    state: String,
    country: String,
    pictureURL: String,
    placeID: String
}, {timestamps: true})


module.exports = mongoose.model("Place", placeScheme);
