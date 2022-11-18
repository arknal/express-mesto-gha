const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const authMiddleware = require('../middlewares/auth');

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
    link: Joi.string().required().uri(),
  }),
}), createCard);

router.delete('/cards/:cardId', celebrate({
  query: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  query: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), addLike);

router.delete('/cards/:cardId/likes', celebrate({
  query: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), removeLike);

module.exports = router;
