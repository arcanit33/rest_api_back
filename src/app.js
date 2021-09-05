const express = require("express")
const mongoose = require("mongoose")
const { DATABASE_URL, SERVER_PORT } = require('./config.js')
const { nullFilterMiddleware} = require('./utils.js')

const routeAuth = require("./routes/auth")
const routeGenres = require("./routes/genres")
const routeArtist = require("./routes/artist")
const routeAlbum = require("./routes/album")
 

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(nullFilterMiddleware)
app.use("/", routeAuth)
app.use("/", routeGenres)
app.use("/", routeArtist)
app.use("/", routeAlbum)


const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true }

mongoose
  .connect(DATABASE_URL, connectionOptions)
  .then(() => console.log(`Mongo database connected: ${DATABASE_URL}`))
  .then(() =>
    app.listen(SERVER_PORT, () => console.log(`Server started: ${SERVER_PORT}`))
  )
  .catch(err => console.log(`Start error: ${err}`))
