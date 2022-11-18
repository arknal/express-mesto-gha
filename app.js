require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');

const { celebrate, Joi, errors } = require('celebrate');

const { login, createUser } = require('./controllers/users');

const userRoutes = require('./routes/users');

const cardsRoutes = require('./routes/cards');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    about: Joi.string().required().min(4),
  }).unknown(true),
}), createUser);
app.use('/', userRoutes);
app.use('/', cardsRoutes);
app.use(errors());
app.use(errorHandler);

app.use((req, res) => {
  res.status(404).send({
    message: '404 Not Found',
  });
});

app.listen(PORT);
