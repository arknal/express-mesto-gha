const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://i.pinimg.com/originals/b6/4d/83/b64d83db4a557b546462ca15150ff125.gif',
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
