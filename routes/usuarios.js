const express = require("express");

const router = express.Router();

const {
   signin,
   signup,
   getParticipantes,
   getAllUsers,
   requestPasswordReset,
   resetPassword,
   getById,
   editUser,
   deleteUser
} = require('../controllers/usuarios');


router.post("/signin", signin);
router.post("/signup", signup);
router.post("/requestReset", requestPasswordReset);
router.post("/resetPassword", resetPassword);
router.post("/getParticipantes", getParticipantes);
router.get("/", getAllUsers);
router.get("/:id", getById);
router.patch("/:id", editUser);
router.delete("/:id", deleteUser);

module.exports = router;