const validateEmailFormat = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePasswordStrength = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

module.exports = {
  validateEmailFormat,
  validatePasswordStrength,
};