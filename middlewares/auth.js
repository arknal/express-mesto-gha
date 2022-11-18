const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../error/UnauthorizedError');

const { JWT_SECRET = 'e5941b231be3be054dcec54b7cf2f9f7' } = process.env;

function authMiddleware(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  const payload = jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      throw new UnauthorizedError('Необходима авторизация');
    }
    return decoded;
  });
  req.user = payload;

  return next();
}

module.exports = authMiddleware;
