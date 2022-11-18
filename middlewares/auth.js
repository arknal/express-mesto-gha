const jwt = require('jsonwebtoken');
const ApiError = require('../error/apiError');
const { unauthorizedStatusCode } = require('../utils/consts');

const { JWT_SECRET = 'e5941b231be3be054dcec54b7cf2f9f7' } = process.env;

function authMiddleware(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ApiError(unauthorizedStatusCode, 'Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  const payload = jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      throw new ApiError(unauthorizedStatusCode, 'Необходима авторизация');
    }
    return decoded;
  });
  req.user = payload;

  return next();
}

module.exports = authMiddleware;
