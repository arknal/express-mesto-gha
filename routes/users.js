const router = require('express').Router();

const controller = require('../controllers/UserController');

router.get('/users', controller.getAllUsers);
router.post('/users', controller.createUser);
router.get('/users/:userId', controller.getUserById);
router.patch('/users/me', (req, res) => {
  res.send('Информация обновлена');
});
router.patch('/users/me/avatar', (req, res) => {
  res.send('Аватар обновлен');
});

module.exports = router;
