/* eslint no-unused-vars: 0 */

const apiError = require('../error/apiError');

module.exports = (error, request, response, next) => {
  if (error instanceof apiError) {
    return response.status(error.status).send({ message: error.message });
  }
  return response.status(500).send({ message: 'Непредвиденная ошибка' });
};
