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
router.patch("/editUser/:id", editUser);
router.delete("/deleteUser/:id", deleteUser);
router.get("/getAll", getAllUsers);
router.get("/getById/:id", getById);

module.exports = router;