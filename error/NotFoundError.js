const { notFoundStatusCode } = require('../utils/consts');

class NotFoundError extends Error {
  constructor(status, message) {
    super(message);
    this.status = notFoundStatusCode;
  }
}

module.exports = NotFoundError;
