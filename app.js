const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('./middlewares/cors');
const router = require('./routes/index');
const handleErrors = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { CURRENT_PORT, CURRENT_DATABASE_PATH } = require('./configs/index');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use(cookieParser());

mongoose.connect(CURRENT_DATABASE_PATH, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(handleErrors);

app.listen(CURRENT_PORT);
