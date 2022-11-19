require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');

const { celebrate, Joi, errors } = require('celebrate');

const { urlRegExp } = require('./utils/consts');

const { login, createUser } = require('./controllers/users');

const userRoutes = require('./routes/users');

const cardsRoutes = require('./routes/cards');

const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./error/NotFoundError');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    avatar: Joi.string().pattern(urlRegExp),
  }).unknown(true),
}), createUser);
app.use('/', userRoutes);
app.use('/', cardsRoutes);
app.use(() => {
  throw new NotFoundError('404 Not Found');
});
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
