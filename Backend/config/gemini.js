const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error('System Engine alert: Verification missing for "GEMINI_API_KEY".');
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

module.exports = ai;