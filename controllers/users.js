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
  // SUCCESSFUL_LOGIN,
} = require('../configs/messages');

const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');

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
          secure: true,
        })
        .send({
          // message: SUCCESSFUL_LOGIN,
          email: user.email,
          name: user.name,
        });
    })
    .catch(() => {
      next(new UnauthorizedError(WRONG_EMAIL_OR_PASSWORD));
    });
};

module.exports.findCurrentUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(USER_NOT_FOUND));
      }
      const { email, name } = user;
      return res.send({ email, name });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError(USER_NOT_FOUND));
      } else {
        next(err);
      }
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
        next(new ConflictError(USER_EMAIL_NOT_VALID));
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
              next(new ConflictError(USER_EMAIL_NOT_VALID));
            } else if (err.name === 'ValidationError') {
              next(new BadRequestError(DATA_NOT_VALID_TO_CREATE_USER));
            } else {
              next(err);
            }
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
        next(new NotFoundError(USER_NOT_FOUND));
      } else {
        res.send({ email, name });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(DATA_NOT_VALID_TO_UPDATE_PROFILE));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError(USER_EMAIL_NOT_VALID));
      } else if (!req.user._id) {
        next(new NotFoundError(USER_NOT_FOUND));
      } else {
        next(err);
      }
    });
};
