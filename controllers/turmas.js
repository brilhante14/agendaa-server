const mongoose = require("mongoose");
const { TurmasInfo, Comment } = require("../models/turmasInfo");
const { User } = require("../models/user");

exports.getTurma = async (req, res) => {
    const { id } = req.params;
    
    try {
        const turma = await TurmasInfo.findById(id);

        res.status(200).json(turma);
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
}

exports.getTurmas = async (req, res) => {
    const { page } = req.query;
    
    try {
        const LIMIT = 15;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await TurmasInfo.countDocuments({});

        const turmas = await TurmasInfo.find().sort({ _id: -1}).limit(LIMIT).skip(startIndex);

        res.status(200).json({ data: turmas, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
}

exports.createTurma = async (req, res) => {
   const body = req.body;

   try {
      const novaTurma = await TurmasInfo.create(body);

      res.status(201).json(novaTurma);
   } catch (error) {
      res.status(409).json({ message: error.message});
   }
}

exports.getTurmasBySearch = async (req, res) => {
    const { searchQuery } = req.query;
    
    try {
      const turmas = await TurmasInfo.find(searchQuery ? { "nome": {$regex: searchQuery, $options: 'i'} } : null);
      
      res.json({ data: turmas });
 
    } catch (error) {
       res.status(404).json({ message: error.message });
    }
}

exports.editTurma = async (req, res) => {
   const { id } = req.params;
   const { cronograma, nome, inicio, fim } = req.body;
   try {
      TurmasInfo.findByIdAndUpdate(id, {
         cronograma: cronograma,
         nome: nome,
         inicio: inicio,
         fim: fim
      }, {new: true}, (err, turma) => {
         if(err) throw Error(err);

         res.status(200).json(turma);
      })
   } catch (error) {
      res.status(500).json(turma);
   }
}

exports.finishTurma = async (req, res) => {
   const { id } = req.params;

   try {
      TurmasInfo.findByIdAndUpdate(id, { isFinished: true }, {new: true}, (err, turma) => {
         if(err) throw Error(err);

         res.status(200).json(turma);
      })
   } catch (error) {
      res.status(500).json(turma);
   }
}

exports.deleteTurma = async (req, res) => {
   const { id } = req.params;

   try {
      TurmasInfo.findByIdAndDelete(id, (err, turma) => {
         Comment.deleteMany({'_id': { $in: turma.comments}}, (err, comments) => {
            Comment.deleteMany({'_id': { $in: comments.replies }}).then(() => {
               res.status(200).json({ message: "Success"});
            })
         })
      })
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
}

exports.addParticipante = async (req, res) => {
   const { id } = req.params;
   const { userId } = req.body;

   try {
      User.findById(userId, function(err, user) {
         if(err) throw Error(err);
         
         TurmasInfo.findById(id, function(err, turma) {
            if(err) throw Error(err);

            turma.participantes.push(user);

            turma.save();
         });
      });

      res.status(200).json({ message: "Added with success" });
   } catch (error) {
      res.status(404).json({ message: error.message });  
   }
}

exports.removeParticipante = async(req, res) => {
   const { id } = req.params;
   const { userId } = req.body;

   try {
      User.findById(userId, function(err, user) {
         if(err) throw Error(err);
         
         TurmasInfo.findById(id, function(err, turma) {
            if(err) throw Error(err);

            turma.participantes.pull(user);

            turma.save();
         });
      });

      res.status(200).json({ message: "Removed with success" });
   } catch (error) {
      res.status(404).json({ message: error.message });  
   }
}

exports.getTurmasByParticipante = async(req, res) => {
   const { userId } = req.body;

   try {
      TurmasInfo.find({participantes: userId}, (err, turmas) => {
         if(err) throw Error(err);

         res.status(200).json(turmas);
      })      
   } catch (error) {
      res.status(500).json(error);
   }
}