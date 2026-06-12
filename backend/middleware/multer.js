const multer = require("multer");

const storage = multer.memoryStorage();
// TODO: add file-type or atleast fileFilter
const multerUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = {
  multerUpload,
};
