const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validateAuthInput } = require('../middleware/validationMiddleware');

router.post('/register', validateAuthInput, register);
router.post('/login', validateAuthInput, login);

module.exports = router;