const { badRequestStatusCode } = require('../utils/consts');

class BadRequestError extends Error {
  constructor(status, message) {
    super(message);
    this.status = badRequestStatusCode;
  }
}

module.exports = BadRequestError;
