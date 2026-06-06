const { validateEmailFormat, validatePasswordStrength } = require('../utils/validations');

const validateAuthInput = (req, res, next) => {
  const { email, password, name } = req.body;

  if (req.path === '/register' && (!name || name.trim() === '')) {
    return res.status(400).json({ success: false, message: 'Valid name field is mandatory.' });
  }
  if (!email || !validateEmailFormat(email)) {
    return res.status(400).json({ success: false, message: 'Provide a syntactically correct email address.' });
  }
  if (!password || !validatePasswordStrength(password)) {
    return res.status(400).json({ success: false, message: 'Password must contain a baseline of 6 characters.' });
  }
  next();
};

module.exports = { validateAuthInput };