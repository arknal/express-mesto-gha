const router = require('express').Router();
const cardController = require('../controllers/CardController');

router.get('/cards', cardController.getAllCards);
router.post('/cards', cardController.createCard);
router.delete('/cards/:cardId', cardController.deleteCard);
router.put('/cards/:cardId/likes', cardController.addLike);
router.delete('/cards/:cardId/likes', cardController.removeLike);

module.exports = router;
