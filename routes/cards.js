const router = require('express').Router();
const {
  createCard,
  getAllCards,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

router.get('/cards', getAllCards);

router.post('/cards', createCard);

router.delete('/cards/:cardId', deleteCard);

router.put('/cards/:cardId/likes', addLike);

router.delete('/cards/:cardId/likes', removeLike);

module.exports = router;
