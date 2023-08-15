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
  addComment,
  deleteComment,
  getUserCards,
  getSubscribeCards,
} = require('../controllers/cards');

router.use('/cards', authMiddleware);
router.use('/feed', authMiddleware);

router.get('/cards', getAllCards);

router.get('/feed', getSubscribeCards);

router.get('/cards/my', getUserCards);

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

router.post('/cards/:cardId/comment', celebrate({
  params: Joi.object().keys({
    cardId: Joi
      .string()
      .alphanum()
      .length(24)
      .required()
      .hex(),
  }),
}), addComment);

router.delete('/cards/:cardId/comment/:commentId', celebrate({
  params: Joi.object().keys({
    cardId: Joi
      .string()
      .alphanum()
      .length(24)
      .required()
      .hex(),
    commentId: Joi
      .string()
      .alphanum()
      .length(24)
      .required()
      .hex(),
  }),
}), deleteComment);

module.exports = router;
