const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models/index")
async function authentication(req, res, next) {
  try {
    const access_token = req.headers.authorization;
    if (!access_token) {
      throw ("Unauthenticated")
    }
    const [type, token] = access_token.split(" ");
    if (type !== "Bearer") {
      throw ("Unauthenticated")
    }

    const decodedToken = verifyToken(token)
    const loggedUser = await User.findByPk(decodedToken.id)
    if (!loggedUser) {
      throw ("Unauthenticated")
    }
    req.userId = loggedUser.id
    next()
  } catch (error) {
    next(error)
  }
}
module.exports = authentication