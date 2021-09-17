const router = require('express').Router();
const { createMovieValidator, removeMovieValidator } = require('../middlewares/validation');
const {
  getMovies,
  createMovie,
  removeMovieById,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', createMovieValidator, createMovie);

router.delete('/:movieId', removeMovieValidator, removeMovieById);

module.exports = router;
