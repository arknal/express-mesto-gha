const { forbiddenStatusCode } = require('../utils/consts');

class ForbiddenError extends Error {
  constructor(status, message) {
    super(message);
    this.status = forbiddenStatusCode;
  }
}

module.exports = ForbiddenError;
