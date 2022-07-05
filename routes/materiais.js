const express = require("express");
const auth = require('../middleware/auth');

const {
   getMateriaisByTurma,
   addMateriais,
   removeMateriais
} = require('../controllers/materiais');

const router = express.Router();

router.get('/:id', getMateriaisByTurma);
router.post('/:id', addMateriais);
router.delete('/:id', removeMateriais);

module.exports = router;