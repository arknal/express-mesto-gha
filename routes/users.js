const router = require('express').Router();

const controller = require('../controllers/UserController');

const { checkType } = require('../utils/utils');

router.get('/users', controller.getAllUsers);

router.post('/users', (req, res, next) => {
  const { name, about, avatar } = req.body;
  const props = [
    { name: 'name', value: name },
    { name: 'about', value: about },
    { name: 'avatar', value: avatar },
  ];

  props.forEach((item) => checkType(item, 'string'));
  next();
});

router.post('/users', controller.createUser);

router.get('/users/:userId', controller.getUserById);

router.patch('/users/me', (req, res, next) => {
  const { name, about } = req.body;

  const props = [
    { name: 'name', value: name },
    { name: 'about', value: about },
  ];
  props.forEach((item) => checkType(item, 'string'));
  next();
});
router.patch('/users/me', controller.updateUserProfile);

router.patch('/users/me/avatar', (req, res, next) => {
  const { avatar } = req.body;

  checkType({ name: 'avatar', value: avatar }, 'string');

  next();
});
router.patch('/users/me/avatar', controller.updateUserAvatar);

module.exports = router;
