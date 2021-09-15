const { FORBIDDEN } = require('../configs/error_status_codes');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN;
  }
}

module.exports = ForbiddenError;
