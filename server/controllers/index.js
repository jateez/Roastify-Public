const { where } = require("sequelize");
const { User } = require("../models/index")
const { OAuth2Client } = require('google-auth-library');
const { signToken } = require("../helpers/jwt");
const { verifyHashedPassword } = require("../helpers/bcrypt");

class Controller {

  static async index(req, res, next) {
    try {
      console.log(req.body, "<< body")
      console.log(req.headers, "<< headers")
      console.log(req.query, "<< query")
      res.status(200).json({ message: "Welcome to Roastify API" })
    } catch (error) {
      next(error)
    }
  }
  static async register(req, res, next) {
    try {
      const { email, password, fullName } = req.body;
      if (!email || !password) {
        throw ({ name: "EMAIL_AND_PASSWORD_REQUIRED" })
      }
      if (!fullName) {
        throw ({ name: "EMAIL_AND_PASSWORD_REQUIRED" })
      }
      const createdUser = await User.create({ email, password, fullName })

      res.status(201).json({ id: createdUser.id, email, fullName })
    } catch (error) {
      next(error)
    }
  }

  static async loginEmail(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw { name: "CREDENTIALS_REQUIRED" }
      }
      const user = await User.findOne({
        where: {
          email
        }
      });
      if (!user) {
        throw { name: "UNAUTHORIZED" }
      }
      const isPasswordMatch = verifyHashedPassword(password, user.password);
      if (!isPasswordMatch) {
        throw { name: "UNAUTHORIZED" }
      }

      const access_token = signToken({ id: user.id })
      res.status(200).json({ access_token })
    } catch (error) {
      next(error)
    }
  }
  static async loginGoogle(req, res, next) {
    const token = req.headers.google_token;

    try {
      const client = new OAuth2Client();
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      })
      const payload = ticket.getPayload();
      const email = payload.email
      const googleId = payload.sub
      const fullName = payload.name
      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          password: 'viagoogle',
          googleId,
          fullName
        },
        hooks: false
      });

      if (!created) {
        if (user.password !== "viagoogle") {
          throw { name: "USER_REGISTERED_NON_GOOGLE" }
        }
      }
      const access_token = signToken({ id: user.id })
      res.status(200).json({ access_token })
    } catch (error) {
      next(error)
    }
  }
  static async signInSpotify(req, res, next) {
    try {

    } catch (error) {
      next(error)
    }
  }

}
module.exports = Controller;