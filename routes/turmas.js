const express = require("express");
const auth = require('../middleware/auth');

const {
    getTurmas,
    getTurmasBySearch,
    getTurma,
    commentForum
 } = require('../controllers/turmas');

const router = express.Router();

router.get('/', getTurmas);
router.get('/search', getTurmasBySearch);
router.get('/:id', getTurma);
router.get('/:id/commentForum', auth, commentForum);


module.exports = router;