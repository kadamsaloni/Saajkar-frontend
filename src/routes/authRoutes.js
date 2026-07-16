const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const protect = require('../middleware/authMiddleware');
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "User already exists with this email."
            });
        }

        user = new User({
            name,
            email,
            password,
            role
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});

router.get('/profile', protect, (req, res) => {
    res.status(200).json({
        message: "Profile fetched successfully",
        user: req.user
    });
});

module.exports = router;      
