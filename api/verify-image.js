const express = require('express');
const multer = require('multer'); // Middleware for handling file uploads
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// 1. Configure Multer to store files in RAM (Memory), not on disk.
// This is faster and cleaner for a "verify and forget" feature.
const upload = multer({ storage: multer.memoryStorage() });

// 2. Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
router.post('/', upload.single('image'), async (req, res) => {
    try {
        // CHECKPOINT: Did the user actually send a file?
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded. Don\'t send me a URL.' });
        }

        // 3. Convert the file buffer (raw bytes) to Base64 for Gemini
        const imagePart = {
            inlineData: {
                data: req.file.buffer.toString('base64'),
                mimeType: req.file.mimetype,
            },
        };

        // 4. The Prompt - Instruct Gemini to be a detective
        const prompt = `
        Act as an expert digital forensic analyst. Analyze this image for credibility. 
        Check for:
        1. Visual inconsistencies (shadows, lighting, reflections).
        2. Signs of AI generation (glossy skin, weird hands, background blurring).
        3. Text anomalies.
        
        Output a JSON response only:
        {
            "is_suspicious": boolean,
            "authenticity_score": number (0-100, where 100 is perfectly real/authentic and 0 is definitely fake/manipulated),
            "reasoning": "short explanation of findings",
            "verdict": "Real" or "Fake/Manipulated"
        }
        `;

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Clean up the text to ensure it's valid JSON (sometimes Gemini adds markdown backticks)
        const cleanText = text.replace(/```json|```/g, '').trim();

        res.json(JSON.parse(cleanText));

    } catch (error) {
        console.error('Gemini Vision Error:', error);
        res.status(500).json({ error: 'Image verification failed. Check server logs.' });
    }
});

module.exports = router;