const { internalStatusCode } = require('../utils/consts');

class InternalError extends Error {
  constructor(status, message) {
    super(message);
    this.status = internalStatusCode;
  }
}

module.exports = InternalError;
