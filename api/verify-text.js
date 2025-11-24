const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Use 1.5 Flash - it has a 1 Million token context window. 
// It can read "War and Peace" and still find the lie.
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

router.post('/', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text content is required.' });
    }

    // Protection: Cap the input length to prevent abuse (e.g., 50k characters is plenty)
    if (text.length > 50000) {
        return res.status(400).json({ error: 'Text is too long. Limit is 50,000 characters.' });
    }

    try {
        const prompt = `
        Act as a strictly logical fact-checker. Analyze the following text for factual accuracy, logical fallacies, and bias.
        
        Text to analyze:
        "${text}"

        Output ONLY a JSON response in this format:
        {
            "authenticity_score": number (0-100, where 100 is proven fact and 0 is complete fabrication),
            "verdict": "Verified", "Misleading", "False", or "Unverifiable",
            "reasoning": "Concise explanation of the rating. Highlight specific errors if any.",
            "main_claims": ["claim 1", "claim 2"]
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // Clean JSON formatting (Gemini sometimes adds backticks)
        const cleanText = textResponse.replace(/```json|```/g, '').trim();

        res.json(JSON.parse(cleanText));

    } catch (error) {
        console.error('Gemini Text Error:', error);
        res.status(500).json({ error: 'Verification failed. Please try again.' });
    }
});

module.exports = router;