const router = require('express').Router();
const { updateProfileValidator } = require('../middlewares/validation');

const {
  findCurrentUserById,
  updateProfile,
} = require('../controllers/users');

router.get('/me', findCurrentUserById);

router.patch('/me', updateProfileValidator, updateProfile);

module.exports = router;
