const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { signupValidator, signinValidator } = require('../middlewares/validation');
const { PAGE_NOT_FOUND } = require('../configs/error_messages');
const { NOT_FOUND } = require('../configs/error_status_codes');

router.post('/signin', signinValidator, login);

router.post('/signup', signupValidator, createUser);

router.use('/users', auth, require('./users'));

router.use('/movies', auth, require('./movies'));

router.use('/logout', auth, (req, res) => {
  res.clearCookie('jwt', {
    maxAge: 3600000,
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  }).send({ message: 'Выход из учетной записи' });
});

router.use((req, res, next) => {
  const error = new Error(PAGE_NOT_FOUND);
  error.statusCode = NOT_FOUND;
  next(error);
});

module.exports = router;
