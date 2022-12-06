const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const { login, createUser } = require('../controllers/users');

const userRoutes = require('./users');
const cardsRoutes = require('./cards');

const { urlRegExp } = require('../utils/consts');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    avatar: Joi.string().pattern(urlRegExp),
  }).unknown(true),
}), createUser);

router.use('/', userRoutes);

router.use('/', cardsRoutes);

module.exports = router;
