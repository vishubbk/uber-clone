const express = require('express');
const { body, validationResult } = require('express-validator'); 
const router = express.Router();
const userModel = require('../models/userModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

// ✅ Register Route with Validation and User Creation
router.post(
    '/register',
    [
        body('fullname.firstname')
            .isLength({ min: 3 })
            .withMessage('First name must be at least 3 characters long'),
        body('fullname.lastname')
            .isLength({ min: 3 })
            .withMessage('Last name must be at least 3 characters long'),
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address'),
        body('password')
            .isLength({ min: 5 })
            .withMessage('Password must be at least 5 characters long'),
        body('contact')
            .isLength({ min: 10 })
            .isNumeric()
            .withMessage('Mobile number must be at least 10 digits and numeric')
    ],
    async (req, res) => {
        // ✅ Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { fullname, email, password, contact } = req.body;

            if (!fullname || !fullname.firstname || !fullname.lastname || !email || !password || !contact) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // ✅ Check if user already exists
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // ✅ Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // ✅ Correct user creation method
            const newUser = new userModel({
                fullname: {
                    firstname: fullname.firstname,
                    lastname: fullname.lastname
                },
                email,
                password: hashedPassword,
                contact
            });

            await newUser.save(); // ✅ Save user to DB

            // ✅ Generate JWT token
            const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // ✅ Correct way to set cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict'
            });

            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }
);


// ✅ Login Route with Validation and User Creation
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Incoming Email:", email);  // Log incoming email
        console.log("Incoming Password:", password);  // Log incoming password

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Check if user exists and include password field
        const user = await userModel.findOne({ email }).select('+password');  // Include password field explicitly
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        console.log("User Password from DB:", user.password);  // Log the hashed password from DB

        // ✅ Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // ✅ Generate JWT token
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // ✅ Correct way to set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        });

        res.status(200).json({ message: "User logged in successfully", user });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.post("/logout", async (req, res) => {
    res.clearCookie("token"); // ✅ Clear cookie
    res.status(200).json({ message: "User logged out successfully" });
});


module.exports = router;
