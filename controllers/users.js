const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ApiError = require('../error/apiError');
const {
  okStatusCode,
  badRequestStatusCode,
  notFoundStatusCode,
  conflictStatusCode,
} = require('../utils/consts');

const { SALT_LENGTH = 10, JWT_SECRET } = process.env;

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
  bcrypt.hash(password, +SALT_LENGTH)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(okStatusCode).send({ user }))
    .catch((e) => {
      switch (e.name) {
        case 'ValidationError':
          next(new ApiError(badRequestStatusCode, 'Ошибка. Некорректные данные'));
          break;
        case e.code === 11000 && 'MongoServerError':
          next(new ApiError(conflictStatusCode, 'Пользователь с таким email уже зарегистрирован'));
          break;
        default:
          next(e);
          break;
      }
    });
}

function getAllUsers(req, res, next) {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((e) => next(e));
}

function getUserById(req, res, next) {
  User.findOne({ _id: req.params.userId })
    .orFail(new ApiError(notFoundStatusCode, 'Ошибка. Пользователь не найден'))
    .then((user) => {
      res.status(okStatusCode).send({ user });
    })
    .catch((e) => {
      switch (e.name) {
        case 'CastError':
          next(new ApiError(badRequestStatusCode, 'Ошибка. Некорректный id пользователя'));
          break;
        default:
          next(e);
          break;
      }
    });
}
function getCurrentUser(req, res, next) {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      res.status(okStatusCode).send({ user });
    })
    .catch(next);
}
function updateUserProfile(req, res, next) {
  const id = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate({ _id: id }, { name, about }, { new: true, runValidators: true })
    .orFail(new ApiError(notFoundStatusCode, 'Ошибка. Пользователь не найден'))
    .then((user) => {
      res.status(okStatusCode).send({ user });
    })
    .catch((e) => {
      switch (e.name) {
        case 'CastError':
          next(new ApiError(badRequestStatusCode, 'Ошибка. Некорректный id пользователя'));
          break;
        case 'ValidationError':
          next(new ApiError(badRequestStatusCode, 'Ошибка. Некорректные данные'));
          break;
        default:
          next(e);
          break;
      }
    });
}

function updateUserAvatar(req, res, next) {
  const id = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate({ _id: id }, { avatar }, { new: true, runValidators: true })
    .orFail(new ApiError(notFoundStatusCode, 'Ошибка. Пользователь не найден'))
    .then((user) => res.status(okStatusCode).send({ user }))
    .catch((e) => {
      switch (e.name) {
        case 'CastError':
          next(new ApiError(badRequestStatusCode, 'Ошибка. Некорректный id пользователя'));
          break;
        case 'ValidationError':
          next(new ApiError(badRequestStatusCode, 'Ошибка. Некорректные данные'));
          break;
        default:
          next(e);
          break;
      }
    });
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
