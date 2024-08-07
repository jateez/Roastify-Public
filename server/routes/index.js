const Controller = require("../controllers/index")
const SpotifyController = require("../controllers/SpotifyController")

const router = require("express").Router()

router.get("/", Controller.index)
router.post("/register", Controller.register)
router.post("/login", Controller.loginEmail)
router.post("/google-login", Controller.loginGoogle)
router.get("/spotify-login", SpotifyController.login)
router.get("/spotify-callback", SpotifyController.callback)
router.get("/spotify/roast", SpotifyController.getUserRoast)

module.exports = { router }