const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/tasks/"); // folder penyimpanan file
  },
  filename: function (req, file, cb) {
    const { taskSubmissionId, userName } = req.fileMeta;

    const sanitizedOriginal = file.originalname.replace(/\s+/g, "_");

    const finalName = `${taskSubmissionId}_${userName}_${sanitizedOriginal}`;

    cb(null, finalName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

module.exports = upload;
