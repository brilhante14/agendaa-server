const mongoose = require("mongoose");

const Comment = mongoose.model('Comment', new mongoose.Schema({
   userId: String,
   text: String,
   createdAt: {
      type: Date,
      default: new Date()
   },
   replies: [{
      _id: String,
      userId: String,
      text: String,
      createdAt: {
         type: Date,
         default: new Date()
      }
   }]
}));

const turmaSchema = mongoose.Schema({
   nome: String,
   professor: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
   participantes: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
   comments: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Comment' 
   }],
   cronograma: {
      type: [Boolean],
      default: [false, false, false, false, false, false, false]
   },
   inicio: {
      type: Date
   },
   fim: {
      type: Date
   },
   isFinished: {
      type: Boolean,
      default: false
   },
   faltasPermitidas:{
      type: Number,
      default: 1
   },
   mediaMinima: {
      type: Number,
      default: 7
   },
   id: { type: String }
});

const TurmasInfo = mongoose.model("TurmasInfo", turmaSchema);

module.exports = { TurmasInfo, Comment };