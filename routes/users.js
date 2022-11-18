const router = require('express').Router();

const authMiddleware = require('../middlewares/auth');

const {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUserAvatar,
  updateUserProfile,
} = require('../controllers/users');

router.use('/users', authMiddleware);

router.get('/users', getAllUsers);

router.get('/users/:userId', getUserById);

router.get('/users/me', getCurrentUser);

router.patch('/users/me', updateUserProfile);

router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
