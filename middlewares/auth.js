const jwt = require('jsonwebtoken');
const { CURRENT_JWT_SECRET } = require('../configs/index');
const { AUTHORIZATION_REQUIRED } = require('../configs/messages');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, CURRENT_JWT_SECRET, { expiresIn: '7d' });
  } catch (err) {
    next(new UnauthorizedError(AUTHORIZATION_REQUIRED));
  }

  req.user = payload;

  next();
};
