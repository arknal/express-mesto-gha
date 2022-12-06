require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');

const { errors } = require('celebrate');

const cors = require('cors');

const router = require('./routes');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use('/', router);
router.use(errors());
app.use(errorHandler);

app.listen(PORT, () => console.log('server started at port', PORT));
