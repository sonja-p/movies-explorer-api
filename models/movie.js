const mongoose = require('mongoose');
const { INVALID_LINK_FORMAT } = require('../configs/error_messages');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  director: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
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
    maxlength: 500,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /https?:\/\/(www.)?[\w-]*\.\w{2}\/?[a-z0-9\S]*/.test(v),
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
      validator: (v) => /https?:\/\/(www.)?[\w-]*\.\w{2}\/?[a-z0-9\S]*/.test(v),
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
    maxlength: 30,
  },
  nameEN: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('movie', movieSchema);
