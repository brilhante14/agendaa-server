const AtividadesInfo = require("../models/atividades");

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

   const novaAtividade = new AtividadesInfo(body);
   try {
      await novaAtividade.save();

      res.status(201).json(novaAtividade);
   } catch (error) {
      res.status(409).json({ message: error.message});
   }
}