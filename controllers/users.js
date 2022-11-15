const bcrypt = require('bcrypt');
const User = require('../models/user');
const ApiError = require('../error/apiError');
const {
  okStatusCode,
  badRequestStatusCode,
  notFoundStatusCode,
} = require('../utils/consts');

const { SALT_LENGTH = 10 } = process.env;

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
    .orFail()
    .then((user) => {
      res.status(okStatusCode).send({ user });
    })
    .catch((e) => {
      switch (e.name) {
        case 'CastError':
          next(new ApiError(badRequestStatusCode, 'Ошибка. Некорректный id пользователя'));
          break;
        case 'DocumentNotFoundError':
          next(new ApiError(notFoundStatusCode, 'Ошибка. Пользователь не найден'));
          break;
        default:
          next(e);
          break;
      }
    });
}

function updateUserProfile(req, res, next) {
  const id = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate({ _id: id }, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(okStatusCode).send({ user });
    })
    .catch((e) => {
      switch (e.name) {
        case 'CastError':
          next(new ApiError(badRequestStatusCode, 'Ошибка. Некорректный id пользователя'));
          break;
        case 'DocumentNotFoundError':
          next(new ApiError(notFoundStatusCode, 'Ошибка. Пользователь не найден'));
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
    .orFail()
    .then((user) => res.status(okStatusCode).send({ user }))
    .catch((e) => {
      switch (e.name) {
        case 'CastError':
          next(new ApiError(badRequestStatusCode, 'Ошибка. Некорректный id пользователя'));
          break;
        case 'DocumentNotFoundError':
          next(new ApiError(notFoundStatusCode, 'Ошибка. Пользователь не найден'));
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
  createUser,
  getAllUsers,
  getUserById,
  updateUserAvatar,
  updateUserProfile,
};
