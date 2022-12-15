const router = require('express').Router();
const authController = require('../controllers/authController');
const restrict = require('../middlewares/restrict');

router.get('/', authController.index);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', restrict, authController.currentUserProfile);


module.exports = router;
