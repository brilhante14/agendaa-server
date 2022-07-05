const mongoose = require("mongoose");

const atividadeSchema = mongoose.Schema({
   nome: String,
   descricao: String,
   prazo: {
      type: Date,
      default: new Date()
   },
   creator: String,
   createdAt: {
      type: Date,
      default: new Date()
   },
   turma: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TurmasInfo'
   }
})

const AtividadesInfo = mongoose.model("AtividadesInfo", atividadeSchema);

module.exports = AtividadesInfo;