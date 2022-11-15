const mongoose = require('mongoose');
const { isEmail, isURL } = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: { validator: (v) => isURL(v) },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: { validator: (v) => isEmail(v) },
  },
  password: {
    type: String,
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
