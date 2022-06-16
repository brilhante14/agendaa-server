const express = require("express");
const auth = require('../middleware/auth');

const {
    getTurmas,
    getTurmasBySearch,
    getTurma,
    commentForum,
    createTurma
 } = require('../controllers/turmas');

const router = express.Router();

router.get('/', getTurmas);
router.post('/', createTurma);
router.get('/search', getTurmasBySearch);
router.get('/:id', getTurma);
router.get('/:id/commentForum', auth, commentForum);


module.exports = router;