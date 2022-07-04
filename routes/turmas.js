const express = require("express");
const auth = require('../middleware/auth');

const {
    getTurmas,
    getTurmasBySearch,
    getTurma,
    createTurma,
    addParticipante,
    deleteTurma,
    getTurmasByParticipante,
} = require('../controllers/turmas');

const {
    commentForum,
    replyComment,
    getCommentsByTurma,
    removeComment,
    editComment,
    getRepliesByComment
} = require('../controllers/comments');

const router = express.Router();

router.get('/', getTurmas);
router.post('/', createTurma);
router.get('/search', getTurmasBySearch);
router.get('/:id', getTurma);
router.post('/getTurmasByParticipantes', getTurmasByParticipante);
router.post('/:id/joinClass', addParticipante);
router.delete('/:id', deleteTurma);
router.get('/:id/getComments', getCommentsByTurma);
router.get("/:id/getRepliesByComment", getRepliesByComment);
router.post('/:id/commentForum', commentForum);
router.post('/replyComment', replyComment);
router.patch('/editComment', editComment);
router.delete('/:id/deleteComment', removeComment);

module.exports = router;