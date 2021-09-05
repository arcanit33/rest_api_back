const express = require('express')
const router = express.Router()
const Albums = require('../models/albums')
const Artist = require('../models/artists')
const Genre = require('../models/genre')
const validator = require('express-validator')
const { jwtMiddleware, authMiddleware } = require('../utils.js')


router.post("/albums",
  jwtMiddleware, authMiddleware, async function (req, res) {
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    if (req.user.role == 0) {
      return res.status(401).json({ errors: errors.array() })
    }
    let name = req.body.name
    let date_released = req.body.date
    let artist_id = req.body.artist_id
    let genre_id = req.body.genre_id


    // Create new albums
    Albums.create(name, date_released, artist_id, genre_id)
      .then(res.status(200).send())
      .catch(err => res.status(500).send(err.toString()))

  })

router.get("/albums", function (req, res) {
  Albums
    .getAll()
    .then(albums => res.status(200).send(albums.map(album => { return { name: album.name, date: album.date_released, id: album.id } })))
    .catch(err => res.status(500).send(err.toString()))
})

router.delete("/albums/:id",
  jwtMiddleware, authMiddleware, async function (req, res) {
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    if (req.user.role == 0) {
      return res.status(401).json({ errors: errors.array() })
    }
    await Albums.delete(req.params.id)
      .then(res.status(200).send())
      .catch(err => {
        console.log(err)
        res.status(500).send(err.toString())
      })
  })


router.get("/albumsbygenre", async (req, res) => {
  let genre_id = req.body.id
  let genre = await Genre.getName(genre_id)

  Albums
    .getAllbyGenre(genre_id)
    .then(albums => res.status(200).send(albums.map(album => { return { name: album.name, genre: genre.name } })))
    .catch(err => res.status(500).send(err.toString()))
})

router.get("/albumsbyartist", async (req, res) => {
  let artist_id = req.body.id
  let artist = await Artist.getName(artist_id)

  Albums
    .getAllbyArtist(artist_id)
    .then(albums => res.status(200).send(albums.map(album => { return { name: album.name, artist: artist.name } })))
    .catch(err => res.status(500).send(err.toString()))
})


router.put("/albums/:id",
  jwtMiddleware, authMiddleware, async function (req, res) {
    const errors = validator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    if (req.user.role == 0) {
      return res.status(401).json({ errors: errors.array() })
    }
    let name = req.body.name
    let date = req.body.date
    let artist_id = req.body.artist_id
    let genre_id = req.body.genre_id

    Albums
      .update(req.params.id, name, date, artist_id, genre_id)
      .then(res.status(200).send())
      .catch(err => res.status(500).send(err.toString()))
  })

module.exports = router
