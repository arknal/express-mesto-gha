const User = require('../models/user');
const ApiError = require('../error/apiError');

class UserController {
  static createUser(req, res, next) {
    const { name, about, avatar } = req.body;
    if (name && about && avatar) {
      User.create(req.body)
        .then((user) => res.send({ user }))
        .catch((e) => next(e));
    } else {
      next(ApiError.badRequest('Некорректные данные'));
    }
  }

  static getAllUsers(req, res, next) {
    User.find({})
      .then((users) => res.send({ users }))
      .catch((e) => next(e));
  }

  static getUserById(req, res, next) {
    User.find({ _id: req.params.userId })
      .then((user) => res.send({ user }))
      .catch((e) => {
        if (e.name === 'CastError') {
          next(ApiError.notFound('Пользователь не найден'));
        } else {
          next(e);
        }
      });
  }

  static updateUserProfile(req, res, next) {
    const id = req.user._id;
    const { name, about } = req.body;
    if (name && about) {
      User.findByIdAndUpdate({ _id: id }, { name, about }, { new: true })
        .then((profile) => res.send({ profile }))
        .catch((e) => {
          if (e.name === 'CastError') {
            next(ApiError.notFound('Пользователь не найден'));
          } else {
            next(e);
          }
        });
    } else {
      next(ApiError.badRequest('Некорректные данные'));
    }
  }

  static updateUserAvatar(req, res, next) {
    const id = req.user._id;
    const { avatar } = req.body;
    if (avatar) {
      User.findByIdAndUpdate({ _id: id }, { avatar }, { new: true })
        .then((profile) => res.send({ profile }))
        .catch((e) => {
          if (e.name === 'CastError') {
            next(ApiError.notFound('Пользователь не найден'));
          } else {
            next(e);
          }
        });
    } else {
      next(ApiError.badRequest('Некорректные данные'));
    }
  }
}
module.exports = UserController;
