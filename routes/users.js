const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const authMiddleware = require('../middlewares/auth');

const { urlRegExp } = require('../utils/consts');

const {
  getUserById,
  getCurrentUser,
  updateUserAvatar,
  updateUserProfile,
  addSubscribe,
  removeSubscribe,
  getAllUsers,
} = require('../controllers/users');

router.use('/users', authMiddleware);

router.get('/users', getAllUsers);

router.get('/users/me', getCurrentUser);

router.patch('/users/:userId/follow', celebrate({
  params: Joi.object().keys({
    userId: Joi
      .string()
      .alphanum()
      .required()
      .hex()
      .length(24),
  }),
}), addSubscribe);

router.delete('/users/:userId/follow', celebrate({
  params: Joi.object().keys({
    userId: Joi
      .string()
      .alphanum()
      .required()
      .hex()
      .length(24),
  }),
}), removeSubscribe);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi
      .string()
      .alphanum()
      .required()
      .hex()
      .length(24),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegExp),
  }),
}), updateUserAvatar);

module.exports = router;
