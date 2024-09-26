const { User, RoastHistory } = require("../models/index")
const { OAuth2Client } = require('google-auth-library');
const { signToken } = require("../helpers/jwt");
const { verifyHashedPassword } = require("../helpers/bcrypt");
const cloudinary = require("../helpers/cloudinary")
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
      const { email, password, fullName } = req.body;
      if (!email || !password) {
        throw ({ name: "CredentialsRequired" })
      }
      const createdUser = await User.create({ email, password, fullName })

      res.status(201).json({ id: createdUser.id, email, fullName })
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const message = error.errors.map(el => el.message);
        error.message = message[0];
      }
      next(error)
    }
  }

  static async loginEmail(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw { name: "CredentialsRequired" }
      }
      const user = await User.findOne({
        where: {
          email
        }
      });
      const isPasswordMatch = verifyHashedPassword(password, user.password);
      if (!user) {
        throw { name: "Unauthorized" }
      }
      if (!isPasswordMatch) {
        throw { name: "Unauthorized" }
      }

      const access_token = signToken({ id: user.id })
      res.status(200).json({ access_token })
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const name = error.errors.map(el => el.message);
        error.name = name;
      }
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

      const access_token = signToken({ id: user.id })
      res.status(200).json({ access_token })
    } catch (error) {
      next(error)
    }
  }
  static async uploadImage(req, res, next) {
    try {
      const uploadedImageData = await cloudinary(req);
      const { userId } = req
      const user = await User.findByPk(userId)
      if (!user) {
        throw { name: "NotFound" }
      }
      await User.update({ imageUrl: uploadedImageData.secure_url }, { where: { id: userId } })
      res.status(200).json({ message: `Success update profile picture` })
    } catch (error) {
      next(error)
    }
  }
  static async getRoast(req, res, next) {
    try {
      const { userId } = req
      const data = await RoastHistory.findAll({
        where: {
          UserId: userId
        }
      })
      res.status(200).json({ data })
    } catch (error) {
      next(error)
    }
  }
  static async getRoastByID(req, res, next) {
    try {
      const { roastId } = req.params
      const data = await RoastHistory.findByPk(
        roastId
      )
      if (!data) {
        throw { name: "NotFound" }
      }
      res.status(200).json({ data })
    } catch (error) {
      next(error)
    }
  }

  static async deleteRoastById(req, res, next) {
    try {
      const { roastId } = req.params
      const foundRoast = await RoastHistory.findByPk(roastId)
      if (!foundRoast) {
        throw { name: "NotFound" }
      }
      await RoastHistory.destroy({ where: { id: roastId } })
      res.status(200).json({ message: `Success delete Roast History` })
    } catch (error) {
      next(error)
    }
  }

  static async getProfile(req, res, next) {
    try {
      const { userId } = req
      const profile = await User.findByPk(userId)
      if (!profile) {
        throw { name: "NotFound" }
      }
      res.status(200).json({ profile })
    } catch (error) {
      next(error)
    }
  }
}
module.exports = Controller;