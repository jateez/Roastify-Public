const multer = require("multer");

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const mutlerUpload = upload.single("image");

module.exports = mutlerUpload;