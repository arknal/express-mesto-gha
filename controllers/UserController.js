const User = require('../models/user');
const ApiError = require('../error/ApiError');

class UserController {
  static createUser(req, res, next) {
    const { name, about, avatar } = req.body;

    if (name.length > 30 || name.length < 2) {
      throw ApiError.badRequest('Ошибка. Длина name должна быть от 2 до 30 символов');
    }
    if (about.length > 30 || about.length < 2) {
      throw ApiError.badRequest('Ошибка. Длина about должна быть от 2 до 30 символов');
    }

    User.create({
      name,
      about,
      avatar,
    })
      .then((user) => res.send({ user }))
      .catch((e) => next(e));
  }

  static getAllUsers(req, res, next) {
    User.find({})
      .then((users) => res.send({ users }))
      .catch((e) => next(e));
  }

  static getUserById(req, res, next) {
    User.findOne({ _id: req.params.userId })
      .then((user) => res.send({ user }))
      .catch((e) => UserController.handleError(e, next));
  }

  static updateUserProfile(req, res, next) {
    const id = req.user._id;
    const { name, about } = req.body;

    User.findByIdAndUpdate({ _id: id }, { name, about }, { new: true })
      .then((profile) => res.send({ profile }))
      .catch((e) => UserController.handleError(e, next));
  }

  static updateUserAvatar(req, res, next) {
    const id = req.user._id;
    const { avatar } = req.body;

    User.findByIdAndUpdate({ _id: id }, { avatar }, { new: true })
      .then((profile) => res.send({ profile }))
      .catch((e) => UserController.handleError(e, next));
  }

  static handleError(error, next) {
    switch (error.name) {
      case 'CastError':
        next(ApiError.notFound('Ошибка. Пользователь не найден'));
        break;
      default:
        next(error);
        break;
    }
  }
}
module.exports = UserController;
