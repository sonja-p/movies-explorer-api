const { celebrate, Joi } = require('celebrate');

const signupValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const signinValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const createMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(100).required(),
    director: Joi.string().min(2).max(100).required(),
    duration: Joi.number().required(),
    year: Joi.string().length(4).required(),
    description: Joi.string().min(2).max(1500).required(),
    image: Joi.string().required().pattern(/\/uploads\/\w*.(?:jpg|jpeg|png)$/),
    trailer: Joi.string().required().pattern(/https?:\/\/(www.)?[\w-]*\.\w{2}\/?[a-z0-9\S]*/),
    thumbnail: Joi.string().required().pattern(/\/uploads\/thumbnail_\w*.(?:jpg|jpeg|png)$/),
    movieId: Joi.number().required(),
    nameRU: Joi.string().min(2).max(100).required(),
    nameEN: Joi.string().min(2).max(100).required(),
  }),
});

const removeMovieValidator = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

const updateProfileValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports = {
  signupValidator,
  signinValidator,
  createMovieValidator,
  removeMovieValidator,
  updateProfileValidator,
};
