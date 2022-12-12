const router = require('express').Router();
const game = require('../controllers/gameController');

router.get('/', game.findAll);
router.post('/', game.newGame);
router.get('/:id', game.findOne);


module.exports = router;
