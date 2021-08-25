const Movie = require('../models/movie');
const {
  MOVIE_NOT_FOUND,
  DATA_NOT_VALID_TO_CREATE_MOVIE,
  NO_RIGHT_TO_DELETE,
} = require('../configs/error_messages');
const { FORBIDDEN } = require('../configs/error_status_codes');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');

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
        next(new BadRequestError(DATA_NOT_VALID_TO_CREATE_MOVIE));
      } else {
        next(err);
      }
    });
};

module.exports.removeMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError(MOVIE_NOT_FOUND));
      } else if (movie.owner.toString() !== req.user._id) {
        const error = new Error(NO_RIGHT_TO_DELETE);
        error.statusCode = FORBIDDEN;
        next(error);
      } else {
        return movie.delete()
          .then(() => {
            res.status(200).send(movie);
          });
      }
      return res;
    })
    .catch((err) => next(err));
};
