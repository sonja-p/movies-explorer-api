const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { CURRENT_JWT_SECRET } = require('../configs/index');
const {
  WRONG_EMAIL_OR_PASSWORD,
  USER_NOT_FOUND,
  USER_EMAIL_NOT_VALID,
  DATA_NOT_VALID_TO_CREATE_USER,
  DATA_NOT_VALID_TO_UPDATE_PROFILE,
} = require('../configs/error_messages');

const {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  CONFLICT,
} = require('../configs/error_status_codes');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, CURRENT_JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: 'None',
          // secure: true,
        })
        .send({ message: 'Успешный вход в аккаунт' });
    })
    .catch(() => {
      const error = new Error(WRONG_EMAIL_OR_PASSWORD);
      error.statusCode = UNAUTHORIZED;
      next(error);
    });
};

module.exports.findCurrentUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        const error = new Error(USER_NOT_FOUND);
        error.statusCode = NOT_FOUND;
        next(error);
      }
      const { email, name } = user;
      return res.send({ email, name });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new Error(USER_NOT_FOUND);
        error.statusCode = NOT_FOUND;
        next(error);
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  const hash = bcrypt.hashSync(password, 10);

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = new Error(USER_EMAIL_NOT_VALID);
        error.statusCode = CONFLICT;
        next(error);
      } else {
        User.create({
          email, password: hash, name,
        })
          .then((newUser) => res.send({
            email: newUser.email,
            name: newUser.name,
          }))
          .catch((err) => {
            if (err.name === 'MongoError' && err.code === 11000) {
              const error = new Error(USER_EMAIL_NOT_VALID);
              error.statusCode = CONFLICT;
              next(error);
            }
            if (err.name === 'ValidationError') {
              const error = new Error(DATA_NOT_VALID_TO_CREATE_USER);
              error.statusCode = BAD_REQUEST;
              next(error);
            }
            next(err);
          });
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        const error = new Error(USER_NOT_FOUND);
        error.statusCode = NOT_FOUND;
        next(error);
      } else {
        res.send({ email, name });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new Error(DATA_NOT_VALID_TO_UPDATE_PROFILE);
        error.statusCode = BAD_REQUEST;
        next(error);
      }
      if (!req.user._id) {
        const error = new Error(USER_NOT_FOUND);
        error.statusCode = NOT_FOUND;
        next(error);
      }
      next(err);
    });
};
