const express = require('express');

const mongoose = require('mongoose');

const userRoutes = require('./routes/users');

const cardsRoutes = require('./routes/cards');

const
  {
    PORT = 3000,
    DB_PATH = 'localhost',
    DB_PORT = '27017',
    DB_NAME = 'mestodb',
  } = process.env;

const app = express();

mongoose.connect(`mongodb://${DB_PATH}:${DB_PORT}/${DB_NAME}`);

app.use('/', userRoutes);
app.use('/', cardsRoutes);

app.listen(PORT, () => {
  console.log('server started at port', PORT);
});
