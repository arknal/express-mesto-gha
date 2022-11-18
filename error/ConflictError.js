const { conflictStatusCode } = require('../utils/consts');

class ConflictError extends Error {
  constructor(status, message) {
    super(message);
    this.status = conflictStatusCode;
  }
}

module.exports = ConflictError;
