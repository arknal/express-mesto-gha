const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const authMiddleware = require('../middlewares/auth');

const { urlRegExp } = require('../utils/consts');

const {
  createCard,
  getAllCards,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

router.use('/cards', authMiddleware);

router.get('/cards', getAllCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegExp),
  }),
}), createCard);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi
      .string()
      .alphanum()
      .length(24)
      .required()
      .hex(),
  }),
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi
      .string()
      .alphanum()
      .length(24)
      .required()
      .hex(),
  }),
}), addLike);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi
      .string()
      .alphanum()
      .length(24)
      .required()
      .hex(),
  }),
}), removeLike);

module.exports = router;
