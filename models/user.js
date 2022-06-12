const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
   nome: { type: String, required: true },
   user: { type: String, required: true },
   email: { type: String, required: true },
   password: { type: String, required: true },
   id: { type: String },
})

module.exports = mongoose.model("User", userSchema);