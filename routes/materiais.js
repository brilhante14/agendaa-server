const express = require("express");
const auth = require('../middleware/auth');
const multer = require("multer");
const multerConfig = require('../config/multer');
// const upload = multer({dest: 'tmp/files'});

const {
   getMateriaisByTurma,
   addMateriais,
   removeMateriais
} = require('../controllers/materiais');

const router = express.Router();

router.get('/:id', getMateriaisByTurma);
router.post('/:id', multer(multerConfig).single("file"), addMateriais);
router.delete('/:id', removeMateriais);

module.exports = router;