const User = require('../models/user');
const ApiError = require('../error/apiError');

function handleError(error, next) {
  switch (error.name) {
    case 'CastError':
      next(new ApiError(400, 'Ошибка. Некорректный id пользователя'));
      break;
    case 'ValidationError':
      next(new ApiError(400, 'Ошибка. Некорректные данные'));
      break;
    default:
      next(error);
      break;
  }
}
function checkUser(user) {
  if (!user) {
    throw new ApiError(404, 'Ошибка. Пользователь с таким id не найден');
  }
}
function createUser(req, res, next) {
  const { name, about, avatar } = req.body;

  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.send({ user }))
    .catch((e) => handleError(e, next));
}

function getAllUsers(req, res, next) {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((e) => next(e));
}

function getUserById(req, res, next) {
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      checkUser(user);
      res.send({ user });
    })
    .catch((e) => handleError(e, next));
}

function updateUserProfile(req, res, next) {
  const id = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate({ _id: id }, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      checkUser(user);
      res.send({ user });
    })
    .catch((e) => handleError(e, next));
}

function updateUserAvatar(req, res, next) {
  const id = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate({ _id: id }, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ user }))
    .catch((e) => handleError(e, next));
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserAvatar,
  updateUserProfile,
};
