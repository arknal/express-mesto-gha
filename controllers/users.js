const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const ConflictError = require('../error/ConflictError');
const NotFoundError = require('../error/NotFoundError');
const { okStatusCode } = require('../utils/consts');

const { JWT_SECRET = 'e5941b231be3be054dcec54b7cf2f9f7', SALT = 10 } = process.env;

function login(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);

      res.status(okStatusCode).send({ token });
    })
    .catch(next);
}
function createUser(req, res, next) {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, +SALT)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const { password: pw, ...info } = user._doc;
      res.status(okStatusCode).send({ info });
    })
    .catch((e) => {
      if (e.code === 11000 && 'MongoServerError') {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      }
      next(e);
    });
}

function getAllUsers(req, res, next) {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
}

function getUserById(req, res, next) {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Ошибка. Пользователь не найден'))
    .then((user) => {
      res.status(okStatusCode).send({ user });
    })
    .catch(next);
}
function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      res.status(okStatusCode).send({ user });
    })
    .catch(next);
}
function updateUserProfile(req, res, next) {
  const id = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate({ _id: id }, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Ошибка. Пользователь не найден'))
    .then((user) => {
      res.status(okStatusCode).send({ user });
    })
    .catch(next);
}

function updateUserAvatar(req, res, next) {
  const id = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate({ _id: id }, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Ошибка. Пользователь не найден'))
    .then((user) => res.status(okStatusCode).send({ user }))
    .catch(next);
}

module.exports = {
  login,
  createUser,
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUserAvatar,
  updateUserProfile,
};
