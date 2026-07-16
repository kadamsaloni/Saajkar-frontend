const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json()); 

// --- ROUTE REGISTRATION ---
// These lines tell your server: "If the URL starts with /api/auth, go to authRoutes.js"
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/products', require('./src/routes/productRoutes')); // 👈 THIS WAS MISSING!

app.get('/api', (req, res) => {
    res.json({ message: "🚀 Saajkar API Engine is live!" });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Cloud Cluster successfully connected!'))
    .catch(err => console.error('❌ Database Handshake Failed:', err.message));

app.listen(PORT, () => {
    console.log(`🚀 Server safely executing on port ${PORT}`);
});