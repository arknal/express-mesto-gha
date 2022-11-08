const router = require('express').Router();

const {
  getAllUsers,
  createUser,
  getUserById,
  updateUserAvatar,
  updateUserProfile,
} = require('../controllers/users');

router.get('/users', getAllUsers);

router.post('/users', createUser);

router.get('/users/:userId', getUserById);

router.patch('/users/me', updateUserProfile);

router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
