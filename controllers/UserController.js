const User = require('../models/user');

class UserController {
  static createUser(req, res) {
    User.create(req.body)
      .then((user) => res.send({ user }))
      .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
  }

  static getAllUsers(req, res) {
    User.find({})
      .then((users) => res.send({ users }))
      .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
  }

  static getUserById(req, res) {
    User.find({ _id: req.params.userId })
      .then((user) => res.send({ user }))
      .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
  }
}
module.exports = UserController;
