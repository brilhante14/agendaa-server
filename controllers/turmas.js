// const mongoose = require("mongoose");
// const { TurmasInfo, Comment } = require("../models/turmasInfo");
// const { User } = require("../models/user");
const db = require("../database/db");

exports.getTurma = async (req, res) => {
   const { id } = req.params;

   try {
      //   const turma = await TurmasInfo.findById(id);
      const turma = await db.exec("SELECT * FROM Turmas WHERE id = ?", id);

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
      // const countRows = await TurmasInfo.countDocuments({});
      // const turmas = await TurmasInfo.find().sort({ _id: -1}).limit(LIMIT).skip(startIndex);
      
      const countRows = await db.exec("SELECT COUNT(*) as total FROM Turmas");
      const turmas = await db.exec("SELECT * FROM Turmas LIMIT ?, ?", [startIndex, LIMIT]);

      res.status(200).json({ data: turmas, currentPage: Number(page), numberOfPages: Math.ceil(countRows[0].total / LIMIT) });
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
}

exports.createTurma = async (req, res) => {
   const body = req.body;

   try {
      // const novaTurma = await TurmasInfo.create(body);
      const newTurma = await db.exec(
         "INSERT INTO Turmas (name, professorId, cronograma, inicio, fim, isFinished, faltasPermitidas, mediaMinima) VALUES (?)", 
         [Object.values(body)]);

      res.status(201).json(newTurma);
   } catch (error) {
      res.status(409).json({ message: error.message });
   }
}

exports.getTurmasBySearch = async (req, res) => {
   const { searchQuery } = req.query;

   try {
      // const turmas = await TurmasInfo.find(searchQuery ? { "nome": { $regex: searchQuery, $options: 'i' } } : null);
      const turmas = await db.exec("SELECT * FROM Turmas WHERE name LIKE ?", `%${searchQuery}%`);

      res.json({ data: turmas });

   } catch (error) {
      res.status(404).json({ message: error.message });
   }
}

exports.editTurma = async (req, res) => {
   const { id } = req.params;
   const { cronograma, nome, inicio, fim, mediaMinima, faltasPermitidas } = req.body;
   try {
      // TurmasInfo.findByIdAndUpdate(id, {
      //    cronograma: cronograma,
      //    nome: nome,
      //    inicio: inicio,
      //    fim: fim,
      //    mediaMinima,
      //    faltasPermitidas
      // }, { new: true }, (err, turma) => {
      //    if (err) throw Error(err);
      // })
      let sql = "UPDATE Turmas SET";
      let values = [];
      if(cronograma){
         sql += " cronograma = ?,";
         values.push(cronograma);
      }
      if(nome){
         sql += " name = ?,";
         values.push(nome);
      }
      if(inicio){
         sql += " inicio = ?,";
         values.push(inicio);
      }
      if(fim){
         sql += " fim = ?,";
         values.push(fim);
      }
      if(mediaMinima){
         sql += " mediaMinima = ?,";
         values.push(mediaMinima);
      }
      if(faltasPermitidas){
         sql += " faltasPermitidas = ?,";
         values.push(faltasPermitidas);
      }

      sql = sql.slice(0, -1) + " WHERE id = ?"
      values.push(id);

      const turma = await db.exec(sql, values);
      
      res.status(200).json(turma);
   } catch (error) {
      res.status(500).json(turma);
   }
}

exports.finishTurma = async (req, res) => {
   const { id } = req.params;

   try {
      // TurmasInfo.findByIdAndUpdate(id, { isFinished: true }, { new: true }, (err, turma) => {
      //    if (err) throw Error(err);
      // })

      const turma = await db.exec("UPDATE Turmas SET isFinished = 1 WHERE id = ?", id);

      res.status(200).json(turma);
   } catch (error) {
      res.status(500).json(turma);
   }
}

exports.deleteTurma = async (req, res) => {
   const { id } = req.params;

   try {
      // TurmasInfo.findByIdAndDelete(id, (err, turma) => {
      //    Comment.deleteMany({ '_id': { $in: turma.comments } }, (err, comments) => {
      //       Comment.deleteMany({ '_id': { $in: comments.replies } }).then(() => {
         //       })
         //    })
         // })
      await db.exec("DELETE FROM Turmas WHERE id = ?", id);
      res.status(200).json({ message: "Success" });
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
}

exports.addParticipante = async (req, res) => {
   const { id } = req.params;
   const { userId } = req.body;

   try {
      // User.findById(userId, function (err, user) {
      //    if (err) throw Error(err);

      //    TurmasInfo.findById(id, function (err, turma) {
      //       if (err) throw Error(err);

      //       turma.participantes.push(user);

      //       turma.save();
      //    });
      // });
      await db.exec("INSERT INTO TurmasParticipantes VALUES (?)", [[id, userId]]);

      res.status(200).json({ message: "Added with success" });
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
}

exports.removeParticipante = async (req, res) => {
   const { id } = req.params;
   const { userId } = req.body;

   try {
      // User.findById(userId, function (err, user) {
      //    if (err) throw Error(err);

      //    TurmasInfo.findById(id, function (err, turma) {
      //       if (err) throw Error(err);

      //       turma.participantes.pull(user);

      //       turma.save();
      //    });
      // });
      await db.exec("DELETE FROM TurmasParticipantes WHERE turmaId = ? AND participanteId = ?", [id, userId]);

      res.status(200).json({ message: "Removed with success" });
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
}

exports.getTurmasByParticipante = async (req, res) => {
   const { userId } = req.body;

   try {
      // TurmasInfo.find({ participantes: userId }, (err, turmas) => {
      //    if (err) throw Error(err);

      // })

      const turmas = await db.exec(
         "SELECT * FROM Turmas INNER JOIN TurmasParticipantes ON Turmas.id = TurmasParticipantes.turmaId WHERE TurmasParticipantes.participanteId = ?", userId);
      res.status(200).json(turmas);
   } catch (error) {
      res.status(500).json(error);
   }
}

exports.getTurmasByProfessor = async (req, res) => {
   const { professorId } = req.body;

   try {
      // TurmasInfo.find({ professor: professorId }, (err, turmas) => {
      //    if (err) throw Error(err);

      // })
      const turmas = await db.exec("SELECT * FROM Turmas WHERE professorId = ?", professorId);
         
      res.status(200).json(turmas);
   } catch (error) {
      res.status(500).json(error);
   }
}