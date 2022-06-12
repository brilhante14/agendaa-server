const mongoose = require("mongoose");
const AtividadesInfo = require("../models/atividadesInfo");

exports.getAtividades = async (req, res) => {
   try {
      const atividades = await AtividadesInfo.find();

      res.status(200).json(atividades);
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
}

exports.createAtividades = async (req, res) => {
   const body = req.body;

   const novaAtividade = new AtividadesInfo({ ...body, creator: req.userID, createdAt: new Date().toISOString() });
   try {
      await novaAtividade.save();

      res.status(201).json(novaAtividade);
   } catch (error) {
      res.status(409).json({ message: error.message});
   }
}

exports.updateAtividades = async (req, res) => {
   const { id: _id } = req.params;
   const body = req.body;

   if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({ message: "Nenhuma atividade para esse id" });

   const updateAtividade = await AtividadesInfo.findByIdAndUpdate(_id, body, { new: true });

   res.json(updateAtividade);
}

exports.deleteAtividades = async (req, res) => {
   const { id } = req.params;

   if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "Nenhuma atividade para esse id" });

   await AtividadesInfo.findByIdAndRemove(id);
   
   res.status(200).json({ message: "Atividade removida com sucesso."});
}