const express = require("express");
const auth = require('../middleware/auth');

const {
   getAtividades,
   createAtividades,
   updateAtividades,
   deleteAtividades
} = require('../controllers/atividades');

const router = express.Router();

router.get('/', getAtividades);
router.post('/', auth, createAtividades);
router.patch('/:id', auth, updateAtividades);
router.delete('/:id', auth, deleteAtividades);

module.exports = router;