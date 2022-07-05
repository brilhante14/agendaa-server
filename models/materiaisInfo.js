const mongoose = require("mongoose");

const materiaisSchema = mongoose.Schema({
   nome: String,
   link: String,
   author:  { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },
   turma: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TurmasInfo'
   }
})

const MateriaisInfo = mongoose.model("MateriaisInfo", materiaisSchema);

module.exports = MateriaisInfo;