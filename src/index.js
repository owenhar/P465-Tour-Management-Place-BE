const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Place = require('../models/Place')
const Hotel = require('../models/Hotel')
const Flight = require('../models/Flight')
const jwt = require("jsonwebtoken");
const fs = require('fs');
const privateKey = fs.readFileSync('.private-key')
const User = require("../models/userModel");
const Review = require("../models/Review")

const dbUrl = process.env.DB || "mongodb://127.0.0.1:4002/"
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

/**
 * Update details of a hotel by ID.
 * 
 * @route PUT /updateHotels/:id
 * @param {string} id - The ID of the hotel to update.
 * @param {string} name - The new name of the hotel (optional).
 * @param {string} description - The new description of the hotel (optional).
 * @param {number} price - The new price of the hotel (optional).
 * @param {string} amenities - A comma-separated string of new amenities for the hotel (optional).
 * @returns {object} - Returns a JSON object indicating success or failure of the update operation.
 * @author avmandal
 */
app.put('/updateHotels/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, amenities } = req.body;

        // Check if the hotel exists
        const hotel = await Hotel.findById(id);
        if (!hotel) {
            return res.json({ "message": "Hotel not found" });
        }

        // Update hotel details
        if (name) {
            hotel.name = name;
        }
        if (description) {
            hotel.description = description;
        }
        if (price) {
            hotel.price = price;
        }
        if (amenities) {
            const amenitiesArray = amenities.split(/\s*,\s*/).map(item => item.trim());
            hotel.amenities = amenitiesArray;

            console.log("Amenities array:", amenitiesArray)
        }

        // Save the updated hotel
        await hotel.save();

        res.json({ "message": "Hotel updated successfully", hotel });
    } catch (error) {
        console.error(error);
        res.json({ "error": "Internal Server Error" });
    }
});


/**
 * Delete a hotel by ID.
 * 
 * @route DELETE /deleteHotels/:id
 * @param {string} id - The ID of the hotel to delete.
 * @returns {object} - Returns a JSON object indicating success or failure of the delete operation.
 * @author avmandal
 */
app.delete('/deleteHotels/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the hotel exists
        const hotel = await Hotel.findById(id);
        if (!hotel) {
            return res.json({ "message": "Hotel not found" });
        }

        // Delete the hotel
        await hotel.deleteOne();

        res.json({ "message": "Hotel deleted successfully" });
    } catch (error) {
        console.error(error);
        res.json({ "error": "Internal Server Error" });
    }
});

/**
 * Search hotels based on location, price range, and amenities.
 * 
 * @route GET /searchHotels
 * @param {string} location - The ID of the location where the hotel is situated (optional).
 * @param {number} minPrice - The minimum price of the hotel (optional).
 * @param {number} maxPrice - The maximum price of the hotel (optional).
 * @param {string} amenities - A comma-separated string of amenities to filter hotels (optional).
 * @returns {object} - Returns a JSON object containing a list of hotels matching the search criteria.
 * @author avmandal
 */
app.get('/searchHotels', async (req, res) => {
    try {
        const { location, minPrice, maxPrice, amenities } = req.query;

        let query = {};

        if (location) {
            if (!mongoose.Types.ObjectId.isValid(location)) {
                return res.status(403).json({ "error": "Invalid location" });
            }
            query.location = new mongoose.Types.ObjectId(location);
        }

        if (minPrice && maxPrice) {
            query.price = { $gte: minPrice, $lte: maxPrice };
        } else if (minPrice) {
            query.price = { $gte: minPrice };
        } else if (maxPrice) {
            query.price = { $lte: maxPrice };
        }

        if (amenities) {
            const amenitiesArray = amenities.split(/\s*,\s*/).map(item => item.trim());
            query.amenities = { $in: amenitiesArray };
        }

        const hotels = await Hotel.find(query);

        if (hotels.length === 0) {
            return res.status(404).json({ "message": "No hotels found" });
        }

        res.json({ "message": "Hotels retrieved successfully", hotels });
    } catch (error) {
        console.error(error);
        res.status(500).json({ "error": "Internal Server Error" });
    }
});


/**
 * Filter hotels based on rating, price range, and amenities.
 * 
 * @route GET /filterHotels
 * @param {number} minRating - The minimum rating of hotels to filter by (optional).
 * @param {number} maxRating - The maximum rating of hotels to filter by (optional).
 * @param {number} minPrice - The minimum price of hotels to filter by (optional).
 * @param {number} maxPrice - The maximum price of hotels to filter by (optional).
 * @param {string} amenities - A comma-separated string of amenities to filter hotels (optional).
 * @returns {object} - Returns a JSON object containing a list of filtered hotels.
 * @author avmandal
 */
app.get('/filterHotels', async (req, res) => {
    try {
        const { minRating, maxRating, minPrice, maxPrice, amenities } = req.query;

        let query = {};

        if (minRating && maxRating) {
            query.ratings = {
                $gte: parseFloat(minRating),
                $lte: parseFloat(maxRating)
            };
        } else if (minRating) {
            query.ratings = { $gte: parseFloat(minRating) };
        } else if (maxRating) {
            query.ratings = { $lte: parseFloat(maxRating) };
        }

        if (minPrice && maxPrice) {
            query.price = { $gte: minPrice, $lte: maxPrice };
        } else if (minPrice) {
            query.price = { $gte: minPrice };
        } else if (maxPrice) {
            query.price = { $lte: maxPrice };
        }

        if (amenities) {
            const amenitiesArray = amenities.split(",").map(item => item.trim());
            query.amenities = { $all: amenitiesArray }; 
        }

        const hotels = await Hotel.find(query);

        if (hotels.length === 0) {
            return res.status(404).json({ "message": "No hotels found" });
        }

        res.json({ "message": "Hotels filtered successfully", hotels});
    } catch (error) {
        console.error(error);
        res.status(500).json({ "error": "Internal Server Error" });
    }
});

/**
 * Upload image URLs for a hotel.
 * 
 * @route POST /upload-image-url/:hotelId
 * @param {string} token - JWT token for user authentication.
 * @param {array} imageUrls - An array of image URLs to upload for the hotel.
 * @param {string} hotelId - The ID of the hotel to upload images for.
 * @returns {object} - Returns a JSON object indicating success or failure of the image upload operation.
 * @author avmandal
 */
app.post('/upload-image-url/:hotelId', async (req, res) => {
    const { token, imageUrls } = req.body;
    try {
        let user = await verifyUserLogIn(token);
        if (user.error) {
            return res.status(403).json(user);
        }
        const hotelId = req.params.hotelId;
    
        if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
            return res.status(400).json({ error: 'No image URLs provided or invalid format' });
        }
    
        const hotel = await Hotel.findByIdAndUpdate(hotelId, { $push: { hotelImagesURL: { $each: imageUrls } } }, { new: true });
    
        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }
    
        return res.status(200).json({ message: 'Hotel image URLs uploaded successfully', hotel });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
  });

/**
 * Add a review and rating for a hotel.
 * 
 * @route POST /add-review/:hotelId
 * @param {string} token - JWT token for user authentication.
 * @param {string} reviewText - The text content of the review.
 * @param {number} rating - The rating given for the hotel (1-5).
 * @param {string} hotelId - The ID of the hotel to add the review for.
 * @returns {object} - Returns a JSON object indicating success or failure of the review addition operation.
 * @author avmandal
 */
app.post('/add-review/:hotelId', async (req, res) => {
    const { token ,reviewText, rating } = req.body;
    try {
    let user = await verifyUserLogIn(token);
    if (user.error) {
        return res.status(403).json(user);
    }

    const hotelId = req.params.hotelId;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const newReview = new Review({
      reviewText: reviewText,
      rating: rating,
      userId: user._id
    });

    await newReview.save();
    hotel.reviews.push(newReview._id);

    // Calculate the new average rating for the hotel
    const totalRatings = hotel.reviews.length;
    const currentTotalRating = hotel.ratings * (totalRatings - 1); // Get the current total rating
    hotel.ratings = (currentTotalRating + rating) / totalRatings; // Calculate the new average rating

    // Save the updated hotel document
    await hotel.save();

    return res.status(200).json({ message: 'Review added successfully', hotel });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

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

async function verifyUserLogIn(token) {
    return jwt.verify(token, privateKey, async (err, data) => {
        if (err) {
            return { "error": "Unable to verify login" }
        } else {
            const loggedInUser = await User.findById(data.id);
            if (!loggedInUser) {
                return { "error": "Unable to verify login" }
            } else {
                return loggedInUser;
            }
        }
    })
}

/**
 * Add a review and rating for a place.
 * 
 * @route POST /add-review/:placeId
 * @param {string} token - JWT token for user authentication.
 * @param {string} reviewText - The text content of the review.
 * @param {number} rating - The rating given for the place (1-5).
 * @param {string} placeId - The ID of the place to add the review for.
 * @returns {object} - Returns a JSON object indicating success or failure of the review addition operation.
 * @author avmandal
 */
 app.post('/add-review/:placeId', async (req, res) => {
    const { token ,reviewText, rating } = req.body;
    try {
        let user = await verifyUserLogIn(token);
        if (user.error) {
            return res.status(403).json(user);
        }
        const placeId = req.params.placeId;
        const place = await Place.findById(placeId);
        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }

        const newReview = new Review({
            reviewText: reviewText,
            rating: rating,
            userId: user._id
        });
        await newReview.save();
        place.reviews.push(newReview._id);

        // Update average rating for the place
        const totalRatings = place.reviews.length;
        const currentTotalRating = place.ratings * (totalRatings - 1); // Get the current total rating
        place.ratings = (currentTotalRating + rating) / totalRatings; // Calculate the new average rating

        await place.save();
        return res.status(200).json({ message: 'Review added successfully', place });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3002);