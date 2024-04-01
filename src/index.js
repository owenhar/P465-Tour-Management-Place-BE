const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Place = require('../models/Place')
const Hotel = require('../models/Hotel')
const Flight = require('../models/Flight')

const dbUrl = process.env.DB || "mongodb://localhost:27017/"
console.log(dbUrl);

mongoose.connect(dbUrl).then(() => console.log("MongoDB connected!"))
const app = express();
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Hello world -- Owen Harris");
})

const genPlaceID = (city, state, country) => {
    return 
}
const genHotelID = (name, location)=>{
    return `${name}-${location.city}`;
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
app.get('/place/search', async (req, res) => {
    try{
        const query = req.query.q;
        const places = await Place.find({ searchTags: { $regex: query, $options: 'i' } });
        res.json({ "message": "Places retrieved successfully", places });
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

//Create a new hotel object
app.post('/createHotel', async (req, res) => {
    try{
        const { name, location, pictureURL, description, price, ratings} = req.body;
        if (!mongoose.Types.ObjectId.isValid(location)) {
        return res.json({ "error": "Invalid location ID" });
        }
        if (!(name && location)) {
            return res.json({ "error": "Needs fields name, location" });
        }


        let newHotel= await Hotel.create({
            name,
            location,
            pictureURL,
            price,
            "hotelID": genHotelID(name, location),
            description,
            ratings,
            reviews: []
        });

        res.json({ "message": "New Hotel created", "id": newHotel._id });
    } catch (error) {
        console.error(error);
        res.json({ "error": "Internal Server Error" });
    }
})

//Retrieve all hotels saved in the database
app.get('/hotels/', async (req,res)=>{
    try {
        const hotels = await Hotel.find();

        res.json({ "message": "Hotels retrived successfully", hotels });
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
//Get a sample of 6 hotels for page
app.get('/hotel/home', async (req, res) => {
    try{
        const randomHotels = await Hotel.aggregate([{ $sample: { size: 6 } }]);
        res.json({ "message": "6 Random Places Found", randomHotels});
    } catch (error) {
        console.error(error);
        res.json({ "error": "Internal Server Error" });
    }
})


app.get('/flights', async (req,res)=>{
    try {
        const flights = await Flight.find();

        res.json({ "message": "Flights retrived successfully", flights });
    } catch (error) {
        console.error(error);
        res.json({ "error": "Internal Server Error" });
    }
})
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

app.post('/createFlight', async (req, res) => {
    try{
        const { flightID, source, destination, miles, pricePerMile, price, favorited } = req.body;
        if (!mongoose.Types.ObjectId.isValid(source) || !mongoose.Types.ObjectId.isValid(destination)) {
        return res.json({ "error": "Invalid source or destination ID" });
        }
        if (!(flightID && source && destination)) {
            return res.json({ "error": "Needs fields name, source location, destination location" });
        }


        let newFlight= await Flight.create({
            flightID,
            source,
            destination,
            pricePerMile,
            price,
            favorited
        });

        res.json({ "message": "New Flight created", "id": newFlight._id });
    } catch (error) {
        console.error(error);
        res.json({ "error": "Internal Server Error" });
    }
})


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

app.get('/place/recomend', async (req, res) => {
    const ip = req.socket.remoteAddress;
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const json = await response.json();
    
    if (json.status == "fail") {
        return res.json({"error": "error", "randomPlaces": []})
    } else {
        let places = await Place.find();
        places.forEach((place) => {
            let dist;
            if (!place.latitude || !place.longitude) {
                dist = 1000000
            } else {
                dist = Math.sqrt(Math.pow(place.latitude - json.lat, 2) + Math.pow(place.longitude - json.lon, 2))
            }
            place.distance = dist;
            console.log(place.distance)
        });
        places = places.sort((a,b) => {
            console.log(b.distance, a.distance, b.distance - a.distance);
            return a.distance - b.distance});
        return res.json(places)
    }


    res.json(json)
}) 

app.listen(3002);