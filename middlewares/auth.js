const jwt = require('jsonwebtoken');
const { CURRENT_JWT_SECRET } = require('../configs/index');
const { AUTHORIZATION_REQUIRED } = require('../configs/error_messages');
const { UNAUTHORIZED } = require('../configs/error_status_codes');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    const error = new Error(AUTHORIZATION_REQUIRED);
    error.statusCode = UNAUTHORIZED;
  }

  let payload;

  try {
    payload = jwt.verify(token, CURRENT_JWT_SECRET, { expiresIn: '7d' });
  } catch (err) {
    const error = new Error(AUTHORIZATION_REQUIRED);
    error.statusCode = UNAUTHORIZED;

    next(error);
  }

  req.user = payload;

  next();
};
