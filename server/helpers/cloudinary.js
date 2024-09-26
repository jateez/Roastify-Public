const cloudinary = require('cloudinary').v2;

async function uploadImage(req) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })
    const base64Image = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${base64Image}`

    return await cloudinary.uploader.upload(dataURI, {
      folder: "Profile_Pictures",
      public_id: req.file.originalname.split(".")[0]
    })
  } catch (error) {
    throw { name: "ErrorUploadingImage", errors: error }
  }
}


module.exports = uploadImage;