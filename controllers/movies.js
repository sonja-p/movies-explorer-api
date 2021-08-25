const Movie = require('../models/movie');
const {
  MOVIE_NOT_FOUND,
  DATA_NOT_VALID_TO_CREATE_MOVIE,
  NO_RIGHT_TO_DELETE,
} = require('../configs/error_messages');
const {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
} = require('../configs/error_status_codes');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner,
    movieId,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new Error(DATA_NOT_VALID_TO_CREATE_MOVIE);
        error.statusCode = BAD_REQUEST;
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.removeMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      const owner = movie.owner.toString();
      if (!movie) {
        const error = new Error(MOVIE_NOT_FOUND);
        error.statusCode = NOT_FOUND;
        next(error);
      } else if (owner !== req.user._id) {
        const error = new Error(NO_RIGHT_TO_DELETE);
        error.statusCode = FORBIDDEN;
        next(error);
      } else {
        movie.delete();
        res.status(200).send(movie);
      }
    })

    .catch((err) => {
      if (err.name === 'TypeError') {
        const error = new Error(MOVIE_NOT_FOUND);
        error.statusCode = NOT_FOUND;
        next(error);
      } else {
        next(err);
      }
    });
};
