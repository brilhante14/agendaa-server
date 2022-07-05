const mongoose = require("mongoose");
const MateriaisInfo = require("../models/materiaisInfo");

exports.getMateriaisByTurma = async (req, res) => {
   const { id } = req.params;

   try {
      MateriaisInfo.find({'turma': id}, (err, materiais) => { 
         if(err) throw Error(err);

         res.status(200).json(materiais);
      });
   } catch (error) {
      res.status(500).json(error);
   }
}

exports.addMateriais = async (req, res) => {
   const { id } = req.params;
   const { nome, link, userId } = req.body;

   try {
      MateriaisInfo.create({nome, link, author: userId, turma: id }, (err, material) => {
         if(err) throw Error(err);

         res.status(201).json(material);
      });

   } catch (error) {
      res.status(409).json(error);
   }
}

exports.removeMateriais = async (req, res) => {
   const { id } = req.params;

   try {
      await MateriaisInfo.findByIdAndRemove(id).then(() => {
         if(err) throw Error(err);
   
         res.status(200).json({ message: "Material deletado com successo"})
      });
   } catch (error) {
      res.status(404).json(error);
   }
}