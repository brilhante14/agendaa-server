const mongoose = require('mongoose');
const { TurmasInfo, Comment } = require('./turmasInfo');

const userSchema = mongoose.Schema({
   nome: { type: String, required: true },
   user: { type: String, required: true, unique: true },
   role: { type: String, enum: ['aluno', 'professor', 'monitor'], required: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   id: { type: String },
   photo: { type: String, default: "https://i.pravatar.cc/150?img=3" },
   resetToken: { type: String }
})

userSchema.post('findByIdAndDelete', document => {
   const userId = document._id;
   TurmasInfo.find({ participantes: { $in: [userId] }}).then(turmas =>{
      Promise.all(
         turmas.map(turma => 
            TurmasInfo.findOneAndUpdate(
               turma._id,
               { $pull: { participantes: userId } },
               { new: true }
            )
         )
      );
   });

   Comment.deleteMany({ userId: userId}).then(() =>{
      Comment.find({}).then(comments => {
         Promise.all(
            comments.map(comment => 
               Comment.findOneAndUpdate(
                  comment._id,
                  { $pull: { 'replies': { '_id': userId} } },
                  { new: true }
               )
            )
         );

      })
   });
})

const User = mongoose.model("User", userSchema);

module.exports = { User };