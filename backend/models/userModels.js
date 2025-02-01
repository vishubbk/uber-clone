const mongoose = require("mongoose");
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt'); 

// ✅ Define the User Schema
const UserSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minLength: [3, 'First name must be at least 3 characters long']
        },
        lastname: {
            type: String,
            
        }
    },

    email: { 
        type: String, 
        unique: true,
        required: true,
        minLength: [5, 'Email must be at least 5 characters long']
    },

    password: { 
        type: String, 
        required: true,
        select: false // ✅ Ensures password is not returned in queries
    },

    contact: {
        type: String, // ✅ Changed from Number to String
        required: true,
        minLength: [10, 'Mobile number must be at least 10 digits']
    },
    
    socketId: { // ✅ Fixed typo (soketId → socketId)
        type: String,
    },
});


// ✅ Export the User model
const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
