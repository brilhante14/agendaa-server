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
    editTurma,
    removeParticipante,
    finishTurma,
} = require('../controllers/turmas');

const {
    commentForum,
    replyComment,
    getCommentsByTurma,
    removeComment,
    editComment,
} = require('../controllers/comments');

const router = express.Router();

router.get('/', getTurmas);
router.post('/', createTurma);
router.get('/search', getTurmasBySearch);
router.get('/:id', getTurma);
router.post('/getTurmasByParticipantes', getTurmasByParticipante);
router.patch('/:id/editTurma', editTurma);
router.get  ('/:id/finishTurma', finishTurma);
router.delete('/:id', deleteTurma);
router.post('/:id/joinClass', addParticipante);
router.post('/:id/removeFromClass', removeParticipante);

router.get('/:id/getComments', getCommentsByTurma);
router.post('/:id/commentForum', commentForum);
router.post('/replyComment', replyComment);
router.patch('/editComment', editComment);
router.delete('/:id/deleteComment', removeComment);

module.exports = router;