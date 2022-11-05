const express = require('express');

const mongoose = require('mongoose');

const userRoutes = require('./routes/users');

const cardsRoutes = require('./routes/cards');

const errorHandler = require('./middlewares/errorHandler');

const
  {
    PORT = 3000,
    DB_PATH = 'localhost',
    DB_PORT = '27017',
    DB_NAME = 'mestodb',
  } = process.env;

const app = express();

mongoose.connect(`mongodb://${DB_PATH}:${DB_PORT}/${DB_NAME}`);

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '63665597293dbe4788db8aeb',
  };

  next();
});

app.use('/', userRoutes);
app.use('/', cardsRoutes);

app.use(errorHandler);

app.listen(PORT);
