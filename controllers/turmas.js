const mongoose = require("mongoose");
const TurmasInfo = require("../models/turmasInfo");

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
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await TurmasInfo.countDocuments({});

        const turmas = await TurmasInfo.find().sort({ _id: -1}).limit(LIMIT).skip(startIndex);

        res.status(200).json({ data: turmas, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
}

exports.getTurmasBySearch = async (req, res) => {
    const { searchQuery } = req.query;
    
    try {
        const name = new RegExp(searchQuery, 'i');
        const turmas = await TurmasInfo.find({ name });

        res.json({ data: turmas });
 
    } catch (error) {
       res.status(404).json({ message: error.message });
    }
}

exports.commentForum = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const turma = await TurmasInfo.findById(id);

    turma.comments.push(value);

    const updatedTurma = await TurmasInfo.findByIdAndUpdate(id, turma, { new: true });

    res.status(200).json(updatedTurma);
}