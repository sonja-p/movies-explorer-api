const mongoose = require('mongoose');
const { INVALID_LINK_FORMAT } = require('../configs/messages');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  director: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
    length: 4,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1500,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /\/uploads\/\w*.(?:jpg|jpeg|png)$/.test(v),
      message: INVALID_LINK_FORMAT,
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /https?:\/\/(www.)?[\w-]*\.\w{2}\/?[a-z0-9\S]*/.test(v),
      message: INVALID_LINK_FORMAT,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /\/uploads\/thumbnail_\w*.(?:jpg|jpeg|png)$/.test(v),
      message: INVALID_LINK_FORMAT,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  nameEN: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
});

module.exports = mongoose.model('movie', movieSchema);
