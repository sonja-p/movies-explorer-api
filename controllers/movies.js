const Movie = require('../models/movie');
const {
  MOVIE_NOT_FOUND,
  DATA_NOT_VALID_TO_CREATE_MOVIE,
  NO_RIGHT_TO_DELETE,
} = require('../configs/messages');
const { OK } = require('../configs/status_codes');
const ForbiddenError = require('../errors/forbidden-error');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
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
        next(new ForbiddenError(NO_RIGHT_TO_DELETE));
      } else {
        return movie.delete()
          .then(() => {
            res.status(OK).send(movie);
          });
      }
      return res;
    })
    .catch((err) => next(err));
};
