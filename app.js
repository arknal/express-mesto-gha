require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./error/NotFoundError');

const app = express();

const { PORT = 3000, CORS_ORIGIN = 'http://localhost:3000' } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(cors({ 'Access-Control-Allow-Origin': CORS_ORIGIN }));
app.use(requestLogger);
app.use('/', router);
app.use(errorLogger);
app.use(errors());
app.use(() => {
  throw new NotFoundError('404 Not Found');
});
app.use(errorHandler);

app.listen(PORT, () => console.log('server started at port', PORT));
