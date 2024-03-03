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

// Helper function to generate search tags
const generateSearchTags = (name, city, state, country) => {
    const tags = [];

    // Add individual words to tags
    tags.push(...name.split(' '), city, state, country);
    return tags;
}

// Get a random place
app.get('/places/random', async (req, res) => {
    try {
        const randPlace = await Place.findOne();
        if (!randPlace) {
            return res.json({ "error": "No places found" });
        }
        res.json(randPlace);
    } catch (error) {
        console.error(error);
        res.json({ "error": "Server error" })
    }
})

// Create a new place
app.post('/createPlace', async (req, res) => {
    try{
        const { name, city, state, country, pictureURL, description, price } = req.body;
        
        if (!(name && city && state && country)) {
            return res.json({ "error": "Needs fields name, city, state, country" });
        }

        // Generate seach tags
        const searchTags = generateSearchTags(name, city, state, country);

        let newPlace = await Place.create({
            name,
            city,
            state,
            country,
            pictureURL,
            price,
            "placeID": genPlaceID(city, state, country),
            description,
            searchTags,
            restaurants: [],
            hotels: [],
            flights: [],
            thingsToDo: [],
        });

        res.json({ "message": "New Place created", "id": newPlace._id });
    } catch (error) {
        console.error(error);
        res.json({ "error": "Internal Server Error" });
    }
})

// Get all places
app.get('/places', async (req, res) => {
    try {
        const places = await Place.find();

        res.json({ "message": "Places retrived successfully", places });
    } catch (error) {
        console.error(error);
        res.json({ "error": "Internal Server Error" });
    }
})

// Get a single place by ID
app.get('/places/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const place = await Place.findById(id)

        if (!place) {
            return res.json({ "message": "Place not found" });
        }

        res.json({ "message": "Place retrived successfully", place });
    } catch (error) {
        console.error(error);
        res.json({ "error": "Internal Server Error" });
    }
})

// Update a place by ID
app.put('/places/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPlace = await Place.findByIdAndUpdate(id, req.body,{ new: true });
        
        if (!updatedPlace) {
            return res.json({ "error": "Place not found" });
        }

        res.json({ "message": "Places updated successfully", updatedPlace });
    } catch (error) {
        console.error(error);
        res.json({ "error": "Internal Server Error" });
    }
})

// Delete a place by ID
app.delete('/places/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Place.findByIdAndDelete(id);
        res.json({ "message": "Place deleted successfully" });
    } catch (error) {
        console.error(error);
        res.json({ "error": "Internal Server Error" });
    }
})

// Get 6 random places for the home screen
app.get('/place/home', async (req, res) => {
    try{
        const randomPlaces = await Place.aggregate([{ $sample: { size: 6 } }]);
        res.json({ "message": "6 Random Places Found", randomPlaces });
    } catch (error) {
        console.error(error);
        res.json({ "error": "Internal Server Error" });
    }
})

// Search Route with Autocomplete Suggestions
app.get('/places/search', async (req, res) => {
    try{
        const query = req.query.q;
        const places = await Place.find({ searchTags: { $regex: query, $options: 'i' } });
        const suggestions = places.map(place => place.name);
        res.json({ "message": "Places retrieved successfully", suggestions });
    } catch (error) {
        console.error(error);
        res.json({ "error": "Internal Server Error" });
    }
})

// Get details of a restaurant by ID
app.get('/restaurants/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.json({ "message": "Restaurant not found" });
        }
        res.json({ "message": "Restaurant retrieved successfully", restaurant });
    } catch (error) {
        console.error(error);
        res.json({ "error": "Internal Server Error" });
    }
});

// Get details of a hotel by ID
app.get('/hotels/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel.findById(id);
        if (!hotel) {
            return res.json({ "message": "Hotel not found" });
        }
        res.json({ "message": "Hotel retrieved successfully", hotel });
    } catch (error) {
        console.error(error);
        res.json({ "error": "Internal Server Error" });
    }
});

// Get details of a flight by ID
app.get('/flights/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const flight = await Flight.findById(id);
        if (!flight) {
            return res.json({ "message": "Flight not found" });
        }
        res.json({ "message": "Flight retrieved successfully", flight });
    } catch (error) {
        console.error(error);
        res.json({ "error": "Internal Server Error" });
    }
});

// Get details of a thing to do by ID
app.get('/things-to-do/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const thingToDo = await ThingsToDo.findById(id);
        if (!thingToDo) {
            return res.json({ "message": "Thing to do not found" });
        }
        res.json({ "message": "Thing to do retrieved successfully", thingToDo });
    } catch (error) {
        console.error(error);
        res.json({ "error": "Internal Server Error" });
    }
});

app.listen(3001);