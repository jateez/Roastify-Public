const Controller = require("../controllers/index")

const router = require("express").Router()

router.get("/", Controller.index)
router.post("/register", Controller.register)
router.post("/login", Controller.loginEmail)
router.post("/google-login", Controller.loginGoogle)

module.exports = { router }