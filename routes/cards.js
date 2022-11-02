const router = require('express').Router();

router.get('/cards', (req, res) => {
  res.send('Все карточки');
});
router.post('/cards', (req, res) => {
  res.send('Карточка создана');
});
router.delete('/cards/:cardId', (req, res) => {
  res.send('Карточка удалена');
});
router.put('/cards/:cardId/likes', (req, res) => {
  res.send('Лайк поставлен');
});
router.delete('/cards/:cardId/likes', (req, res) => {
  res.send('Лайк удален');
});

module.exports = router;
