const express = require("express");
const auth = require('../middleware/auth');

const {
   getAtividades,
   getAtividadesById,   
   createAtividades,
   updateAtividades,
   deleteAtividades
} = require('../controllers/atividades');

const router = express.Router();

router.get('/:id', getAtividades);
router.get('/getById/:id', getAtividadesById)
router.post('/:id', createAtividades);
router.patch('/:id', updateAtividades);
router.delete('/:id', deleteAtividades);

module.exports = router;