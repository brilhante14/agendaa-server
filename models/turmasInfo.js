const mongoose = require("mongoose");
const { User } = require('./user');

const Comment = mongoose.model('Comment', new mongoose.Schema({
   userId: String,
   text: String,
   createdAt: {
      type: Date,
      default: new Date()
   },
   replies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
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
   id: { type: String }
});

const TurmasInfo = mongoose.model("TurmasInfo", turmaSchema);

module.exports = { TurmasInfo, Comment };