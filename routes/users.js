const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const authMiddleware = require('../middlewares/auth');

const {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUserAvatar,
  updateUserProfile,
} = require('../controllers/users');

router.use('/users', authMiddleware);

router.get('/users', getAllUsers);

router.get('/users/me', getCurrentUser);

router.get('/users/:userId', celebrate({
  query: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
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
    avatar: Joi.string().required().uri(),
  }),
}), updateUserAvatar);

module.exports = router;
