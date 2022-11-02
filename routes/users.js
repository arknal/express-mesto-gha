const router = require('express').Router();

router.get('/users', (req, res) => {
  res.send('Все пользователи бд');
});
router.post('/users', (req, res) => {
  res.send(`Пользователь создан ${req}`);
});
router.get('/users/:userId', (req, res) => {
  res.send(`Пользователь с id ${req.params.userId}`);
});
router.patch('/users/me', (req, res) => {
  res.send('Информация обновлена');
});
router.patch('/users/me/avatar', (req, res) => {
  res.send('Аватар обновлен');
});

module.exports = router;
