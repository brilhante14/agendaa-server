const express = require("express");

const router = express.Router();

const {
   signin,
   signup,
   getParticipantes,
   getAllUsers
} = require('../controllers/usuarios');


router.post("/signin", signin);
router.post("/signup", signup);
router.post("/getParticipantes", getParticipantes);
router.get("/getAll", getAllUsers);

module.exports = router;