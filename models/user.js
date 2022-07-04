const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
   nome: { type: String, required: true },
   user: { type: String, required: true, unique: true },
   role: { type: String, enum: ['aluno', 'professor', 'monitor'], required: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   id: { type: String }
})

const User = mongoose.model("User", userSchema);

module.exports = { User };