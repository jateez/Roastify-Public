const Controller = require("../controllers/index")
const SpotifyController = require("../controllers/SpotifyController")
const authentication = require("../middlewares/authentication")
const mutlerUpload = require("../middlewares/mutler")

const router = require("express").Router()

router.get("/", Controller.index)
router.post("/register", Controller.register)
router.post("/login", Controller.loginEmail)
router.post("/google-login", Controller.loginGoogle)
router.get("/roasts", authentication, Controller.getRoast)
router.get("/roasts/:roastId", authentication, Controller.getRoastByID)
router.delete("/roasts/:roastId", authentication, Controller.deleteRoastById)
router.get("/spotify-login", authentication, SpotifyController.login)
router.get("/spotify-callback", SpotifyController.callback)
router.get("/spotify-roast", authentication, SpotifyController.getUserRoast)
router.post("/spotify-search", authentication, SpotifyController.searchSpotify)
router.get("/profile", authentication, Controller.getProfile)
router.patch("/profile", authentication, mutlerUpload, Controller.uploadImage)
// router.post("/custom-roast", authentication, SpotifyController.generateRoast)

module.exports = { router }