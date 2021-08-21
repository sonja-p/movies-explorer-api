const { INTERNAL_SERVER_ERROR } = require('../configs/error_status_codes');
const { SERVER_ERROR_MESSAGE } = require('../configs/error_messages');

module.exports = (err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === INTERNAL_SERVER_ERROR
        ? SERVER_ERROR_MESSAGE
        : message,
    });

  next();
};
