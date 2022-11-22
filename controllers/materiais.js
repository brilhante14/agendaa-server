const db = require("../database/db");
const aws = require("aws-sdk");

exports.getMateriaisByTurma = async (req, res) => {
   const { id } = req.params;

   try {
      const materiais = await db.exec("SELECT * FROM Materiais WHERE turmaId = ?", id);

      res.status(200).json(materiais);
   } catch (error) {
      res.status(500).json(error);
   }
}

exports.addMateriais = async (req, res) => {
   const { originalname: name, size, key, location: url = "" } = req.file;
   const { id } = req.params;
   const { userId } = req.body;

   try {
      const newMaterial = await db.exec("INSERT INTO Materiais (nome, link, authorId, turmaId, fileSize, fileKey) VALUES (?)",
         [[name, url, userId, id, size, key]]);

      res.status(201).json(newMaterial);
   } catch (error) {
      res.status(409).json(error.message);
   }
}

exports.removeMateriais = async (req, res) => {
   const { id } = req.params;

   const s3 = new aws.S3({
      endpoint: 'http://minio:9000/',
      accessKeyId: 'minioadmin',
      secretAccessKey: 'minioadmin',
      s3ForcePathStyle: true,
    });
   try {
      const material = await db.exec("SELECT * FROM Materiais WHERE id = ?", id);

      s3
      .deleteObject({
         Bucket: 'agendaa',
         Key: material[0].fileKey,
      })
      .promise()
      .then(async () => {
         await db.exec("DELETE FROM Materiais WHERE id = ?", id);
         res.status(200).json({ message: "Material deletado com successo" })
      })
      .catch((response) => {
         console.log(response, material);
      });

   } catch (error) {
      res.status(404).json(error);
   }
}
