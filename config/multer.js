const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

const MAX_SIZE_TWO_MEGABYTES = 2 * 1024 * 1024;

const storageTypes = {
//   local: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, path.resolve(__dirname, "..", "tmp", "uploads"));
//     },
//     filename: (req, file, cb) => {
//       crypto.randomBytes(16, (err, hash) => {
//         if (err) cb(err);

//         file.key = `${hash.toString("hex")}-${file.originalname}`;

//         cb(null, file.key);
//       });
//     },
//   })
  s3: multerS3({
    s3: new aws.S3({
      endpoint: 'http://minio:9000/',
      accessKeyId: 'minioadmin',
      secretAccessKey: 'minioadmin',
      s3ForcePathStyle: true,
    }),
    bucket: "agendaa",
    contentType: multerS3.AUTO_CONTENT_TYPE, 
    acl: "public-read",
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        const fileName = `${req.params.id}/${hash.toString("hex")}-${file.originalname}`;

        cb(null, fileName);
      });
    },
  }) 
};

module.exports = {
  dest: path.resolve(__dirname, "..", "tmp", "uploads"),
  storage: storageTypes.s3,
//   storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: MAX_SIZE_TWO_MEGABYTES,
  }
};