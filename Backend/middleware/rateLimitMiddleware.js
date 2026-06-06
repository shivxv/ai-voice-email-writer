const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 200, // Boundary cap limit threshold per IP across timeframe window
  message: {
    success: false,
    message: 'Too many requests dispatched from this IP. Please wait 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const aiGenerationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 Minute
  max: 5, // Cap AI pipelines to prevent upstream credential exhausting spikes
  message: {
    success: false,
    message: 'High frequency requests intercepted. Cap rate limit hit for AI generation.',
  },
});

module.exports = { globalLimiter, aiGenerationLimiter };