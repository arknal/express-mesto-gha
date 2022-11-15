require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');

const userRoutes = require('./routes/users');

const cardsRoutes = require('./routes/cards');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

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

app.use((req, res) => {
  res.status(404).send({
    message: '404 Not Found',
  });
});

app.listen(PORT, () => console.log('server started at port', PORT));
