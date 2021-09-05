const express = require('express')
const router = express.Router()
const Genre = require('../models/genre')
const validator = require('express-validator')
const { jwtMiddleware, authMiddleware } = require('../utils.js')


router.post("/genres",
  jwtMiddleware, authMiddleware, async function (req, res) {
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    if (req.user.role == 0) {
      return res.status(401).json({ errors: errors.array() })
    }
    let name = req.body.name

    const unique = await Genre.find(name)

    if (unique) {
      // If such genres already exists send corresponding message
      res.status(409).send({ message: "such genres exists" })
    } else {
      // Create new genres
      Genre.create(name)
        .then(res.status(200).send())
        .catch(err => res.status(500).send(err.toString()))
    }

  })

router.get("/genres", function (req, res) {
  Genre
    .getAll()
    .then(genres => res.status(200).send({ genres: genres }))
    .catch(err => res.status(500).send(err.toString()))
})

router.delete("/genres/:id",
  jwtMiddleware, authMiddleware, async function (req, res) {
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    if (req.user.role == 0) {
      return res.status(401).json({ errors: errors.array() })

    }
    await Genre.delete(req.params.id)
      .then(res.status(200).send())
      .catch(err => {
        console.log(err)
        res.status(500).send(err.toString())
      })
  })

router.put("/genres/:id",
  jwtMiddleware, authMiddleware, async function (req, res) {
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    if (req.user.role == 0) {
      return res.status(401).json({ errors: errors.array() })

    }
    let name = req.body.name

    Genre
      .update(req.params.id, name)
      .then(res.status(200).send())
      .catch(err => res.status(500).send(err.toString()))
  })

module.exports = router