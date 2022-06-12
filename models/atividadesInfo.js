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
   } 
})

const AtividadesInfo = mongoose.model("AtividadesInfo", atividadeSchema);

module.exports = AtividadesInfo;