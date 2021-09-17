const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { signupValidator, signinValidator } = require('../middlewares/validation');
const { PAGE_NOT_FOUND, EXIT_COMPLETED } = require('../configs/messages');
const NotFoundError = require('../errors/not-found-error');

router.post('/signin', signinValidator, login);

router.post('/signup', signupValidator, createUser);

router.use('/', auth);

router.use('/users', auth, require('./users'));

router.use('/movies', auth, require('./movies'));

router.use('/logout', auth, (req, res) => {
  res.clearCookie('jwt', {
    maxAge: 3600000,
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  }).send({ message: EXIT_COMPLETED });
});

router.use(() => {
  throw new NotFoundError(PAGE_NOT_FOUND);
});

module.exports = router;
