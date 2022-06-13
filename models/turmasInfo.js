const mongoose = require("mongoose");

const turmaSchema = mongoose.Schema({
   nome: String,
   professor: String,
   participantes: Number,
   comments: { type: [String], default: [] },
   id: { type: String }
})

const TurmasInfo = mongoose.model("TurmasInfo", turmaSchema);

module.exports = TurmasInfo;