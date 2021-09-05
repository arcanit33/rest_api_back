const express = require('express')
const router = express.Router()
const User = require('../models/user')
const expressJWT = require('express-jwt')
const validator = require('express-validator')
const { jwtMiddleware, authMiddleware, generateAccessToken } = require('../utils.js')

router.post("/users/register", [
  validator.check('password').isLength({ min: 4 })],
  async (req, res) => {
    let login = req.body.login
    let role = 0
    let password = req.body.password

    const user = await User.find(login)

    if (user) {
      // If such user already exists send corresponding message
      res.status(409).send({ message: "such user exists" })
    } else {
      // Create new user
      User.create(login, role, password)
        .then(res.status(200).send())
        .catch(err => res.status(500).send(err.toString()))
    }

  })



router.post("/users/login", [
  validator.check('password').isLength({ min: 4 })],
  async (req, res) => {
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() })
    }

    let name = req.body.login
    let password = req.body.password

    try {
      let passwordMatched = await User.isUserPasswordCorrect(name, password)
      let role = await User.find(name)
      if (passwordMatched) {
        return res.send({ "access_token": generateAccessToken(name, role.role) })
      } else {
        res.status(400).send({ 'message': "Wrong credentials!" })
      }
    } catch (err) {
      return res.status(422).send({ 'message': err.message })
    }

  })


router.delete("/users/:id",
  jwtMiddleware, authMiddleware, async function (req, res) {
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    if (req.user.role == 0) {
      return res.status(401).json({ errors: errors.array() })

    }

    await User.delete(req.params.id)
      .then(res.status(200).send())
      .catch(err => {
        console.log(err)
        res.status(500).send(err.toString())
      })
  })

router.get("/users",
  jwtMiddleware, authMiddleware, async function (req, res) {
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    if (req.user.role == 0) {
      return res.status(401).json({ errors: errors.array() })

    }
    User
      .getAll()
      .then(user => res.status(200).send({ user: user }))
      .catch(err => res.status(500).send(err.toString()))
  })

router.put("/users/:id",
  jwtMiddleware, authMiddleware, async function (req, res) {
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    if (req.user.role == 0) {
      return res.status(401).json({ errors: errors.array() })

    }

    let login = req.body.login
    let role = req.body.role
    let password = req.body.password

    User
      .update(req.params.id, login, role, password)
      .then(user => res.status(200).send({ user: user }))
      .catch(err => res.status(500).send(err.toString()))
  })

module.exports = router