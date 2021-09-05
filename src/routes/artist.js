const express = require('express')
const router = express.Router()
const Artist = require('../models/artists')
const validator = require('express-validator')
const { jwtMiddleware, authMiddleware } = require('../utils.js')


router.post("/artists",
  jwtMiddleware, authMiddleware, async function (req, res) {
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    if (req.user.role == 0) {
      return res.status(401).json({ errors: errors.array() })
    }
    let name = req.body.name
    let age = req.body.age

    const unique = await Artist.find(name)

    if (unique) {
      // If such artist already exists send corresponding message
      res.status(409).send({ message: "such artist exists" })
    } else {
      // Create new artist
      Artist.create(name, age)
        .then(res.status(200).send())
        .catch(err => res.status(500).send(err.toString()))
    }

  })

router.get("/artists", function (req, res) {
  Artist
    .getAll()
    .then(artists => res.status(200).send({ artists: artists }))
    .catch(err => res.status(500).send(err.toString()))
})

router.delete("/artists/:id",
  jwtMiddleware, authMiddleware, async function (req, res) {
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    if (req.user.role == 0) {
      return res.status(401).json({ errors: errors.array() })
    }

    await Artist.delete(req.params.id)
      .then(res.status(200).send())
      .catch(err => {
        console.log(err)
        res.status(500).send(err.toString())
      })
  })

router.put("/artists/:id",
  jwtMiddleware, authMiddleware, async function (req, res) {
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    if (req.user.role == 0) {
      return res.status(401).json({ errors: errors.array() })
    }
    let name = req.body.name
    let age = req.body.age

    Artist
      .update(req.params.id, name, age)
      .then(res.status(200).send())
      .catch(err => res.status(500).send(err.toString()))
  })

module.exports = router
