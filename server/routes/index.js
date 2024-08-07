const Controller = require("../controllers/index")
const SpotifyController = require("../controllers/SpotifyController")
const mutlerUpload = require("../middlewares/mutler")

const router = require("express").Router()

router.get("/", Controller.index)
router.post("/register", Controller.register)
router.post("/login", Controller.loginEmail)
router.post("/google-login", Controller.loginGoogle)
router.get("/roasts", Controller.getRoast)
router.get("/roasts/:roastId", Controller.getRoastByID)
router.delete("/roasts/:roastId", Controller.deleteRoastById)
router.get("/spotify-login", SpotifyController.login)
router.get("/spotify-callback", SpotifyController.callback)
router.get("/spotify/roast", SpotifyController.getUserRoast)
router.put("/profile", mutlerUpload, Controller.updateProfile)
router.patch("/profile", mutlerUpload, Controller.uploadImage)
module.exports = { router }