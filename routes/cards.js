const router = require('express').Router();
const cardController = require('../controllers/CardController');
const apiError = require('../error/ApiError');

router.get('/cards', cardController.getAllCards);

router.post('/cards', (req, res, next) => {
  const { name, link } = req.body;
  const nameType = typeof name;
  const linkType = typeof link;

  if (!(nameType === 'string')) {
    throw apiError.badRequest(`Ошибка. Тип данных name ${nameType}, ожидалось string`);
  }
  if (!(linkType === 'string')) {
    throw apiError.badRequest(`Ошибка. Тип данных link ${linkType}, ожидалось string`);
  }
  next();
});

router.post('/cards', cardController.createCard);

router.delete('/cards/:cardId', cardController.deleteCard);

router.put('/cards/:cardId/likes', cardController.addLike);

router.delete('/cards/:cardId/likes', cardController.removeLike);

module.exports = router;
