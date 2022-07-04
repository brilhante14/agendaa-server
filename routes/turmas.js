const express = require("express");
const auth = require('../middleware/auth');

const {
    getTurmas,
    getTurmasBySearch,
    getTurma,
    commentForum,
    createTurma,
    addParticipante,
    replyComment,
    getCommentsByTurma,
    removeComment
 } = require('../controllers/turmas');

const router = express.Router();

router.get('/', getTurmas);
router.post('/', createTurma);
router.get('/search', getTurmasBySearch);
router.get('/:id', getTurma);
router.post('/:id/commentForum', commentForum);
router.post('/replyComment', replyComment);
router.post('/:id/joinClass', addParticipante);
router.get('/:id/getComments', getCommentsByTurma);
router.delete('/:id/deleteComment', removeComment);

module.exports = router;