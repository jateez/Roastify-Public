const { where } = require("sequelize");
const { User } = require("../models/index")
const { OAuth2Client } = require('google-auth-library');
const { signToken } = require("../helpers/jwt");
const { verifyHashedPassword } = require("../helpers/bcrypt");

class Controller {

  static async index(req, res, next) {
    try {
      res.status(200).json({ message: "Welcome to Roastify API" })
    } catch (error) {
      next(error)
    }
  }
  static async register(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw ({ name: "EMAIL_AND_PASSWORD_REQUIRED" })
      }
      const createdUser = await User.create({ email, password })

      res.status(201).json({ id: createdUser.id, email })
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
        audience: process.env.CLIENT_ID
      })
      console.log(token, "<<TOKEN")
      const payload = ticket.getPayload();
      console.log(payload, "<<< PAYLOAD")
      const email = payload.email
      const google_id = payload.sub
      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          password: 'viagoogle',
          google_id
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