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
    getTurmasByProfessor,
    editTurma,
    removeParticipante,
    finishTurma,
    getFaltas
} = require('../controllers/turmas');

const {
    commentForum,
    replyComment,
    getCommentsByTurma,
    removeComment,
    editComment,
    removeReply,
    editReply,
} = require('../controllers/comments');

const router = express.Router();

router.get('/', getTurmas);
router.post('/', createTurma);
router.get('/search', getTurmasBySearch);
router.get('/:id', getTurma);
router.post('/getTurmasByParticipantes', getTurmasByParticipante);
router.post('/getTurmasByProfessor', getTurmasByProfessor);
router.patch('/:id', editTurma);
router.get  ('/:id/finishTurma', finishTurma);
router.delete('/:id', deleteTurma);
router.post('/:id/joinClass', addParticipante);
router.post('/:id/removeFromClass', removeParticipante);

router.get('/:id/getComments', getCommentsByTurma);
router.post('/comment', commentForum);
router.patch('/comment/:id', editComment);
router.delete('/comment/:id', removeComment);
router.post('/reply', replyComment);
router.patch('/reply/:id', editReply);
router.delete('/reply/:id', removeReply);

router.post('/:id/getFaltas', getFaltas)

module.exports = router;