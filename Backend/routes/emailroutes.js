const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { aiGenerationLimiter } = require('../middleware/rateLimitMiddleware');
const {
  generateEmail,
  saveHistory,
  getHistory,
  getHistoryById,
  deleteHistory,
  dispatchEmail,
  translateEmail,
} = require('../controllers/emailController');

// Secure router footprint globally
router.use(protect);

router.post('/generate', aiGenerationLimiter, generateEmail);
router.post('/translate', aiGenerationLimiter, translateEmail);
router.post('/send', dispatchEmail);

router.route('/')
  .post(saveHistory)
  .get(getHistory);

router.route('/:id')
  .get(getHistoryById)
  .delete(deleteHistory);

module.exports = router;