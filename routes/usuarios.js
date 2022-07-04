const express = require("express");

const router = express.Router();

const {
   signin,
   signup,
   getParticipantes,
   getAllUsers,
   requestPasswordReset,
   resetPassword
} = require('../controllers/usuarios');


router.post("/signin", signin);
router.post("/signup", signup);
router.post("/requestReset", requestPasswordReset);
router.post("/resetPassword", resetPassword);
router.post("/getParticipantes", getParticipantes);
router.get("/getAll", getAllUsers);

module.exports = router;