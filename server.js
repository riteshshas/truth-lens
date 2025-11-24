const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Import your routers
const textRouter = require('./api/verify-text');
const imageRouter = require('./api/verify-image');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON for the text route

// --- ROUTES ---

// ... existing imports and app definition ...

// Keep your routes defined here
app.use('/api/verify-text', textRouter);
app.use('/api/verify-image', imageRouter);
app.use(express.static(path.join(__dirname, 'public')));

// --- CHANGE THIS SECTION ---

// Only run app.listen if we are LOCALLY testing.
// Vercel exports the app instead of listening.
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export the app for Vercel to use as a serverless function
module.exports = app;