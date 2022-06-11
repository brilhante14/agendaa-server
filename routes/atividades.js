const express = require("express");

const router = express.Router();

const {
   getAtividades,
   createAtividades
} = require('../controllers/atividades');

router.get('/', getAtividades);
router.post('/', createAtividades);


module.exports = router;