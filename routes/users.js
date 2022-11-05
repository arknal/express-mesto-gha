const router = require('express').Router();

const controller = require('../controllers/UserController');

router.get('/users', controller.getAllUsers);
router.post('/users', controller.createUser);
router.get('/users/:userId', controller.getUserById);
router.patch('/users/me', controller.updateUserProfile);
router.patch('/users/me/avatar', controller.updateUserAvatar);

module.exports = router;
