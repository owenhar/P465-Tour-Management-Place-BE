const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Place = require('../models/Place')

mongoose.connect("mongodb://10.1.1.109/admin").then(() => console.log("MongoDB connected!"))

const app = express();
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Hello world -- Owen Harris");
})

const genPlaceID = (city, state, country) => {
    return `${city}-${state}--${country}`;
}

app.post('/createPlace', async (req, res) => {
    try {
        let { name, city, state, country, pictureURL } = req.body;
        if (!(name && city && state && country)) {
            res.json({ "error": "Needs fields name, city, state, country" })
            return;
        };
        if (!pictureURL) pictureURL = "";
        let newPlace = await Place.create({
            name,
            city,
            state,
            country,
            pictureURL,
            "placeID": genPlaceID(city, state, country)

        });
        console.log(newPlace);
        let id = newPlace._id
        res.json({
            "message": "New Place created",
            id
        });
    } catch (error) {
        console.error(error);
        res.json({ "error": "Server error" })
    }
})

app.get('/getRandPlace', async (req, res) => {
    try {
        const RandPlace = await Place.findOne();
        res.json(RandPlace);
    } catch (error) {
        console.error(error);
        res.json({ "error": "Server error" })
    }
})

app.listen(3000);