const mongoose = require("mongoose")

const AlbumsSchema = mongoose.Schema({
  name: { type: String, requier: true },
  date_released: { type: Number, requier: true },
  artist_id: { type: mongoose.Types.ObjectId, required: true },
  genre_id: { type: mongoose.Types.ObjectId, required: true }
})


const AlbumsModel = mongoose.model("Albums", AlbumsSchema)

class Albums {
  constructor(name, date_released, artist_id, genre_id) {
    this.name = name
    this.date_released = date_released
    this.artist_id = artist_id
    this.genre_id = genre_id
  }

  static find(name) {
    return AlbumsModel.findOne({ name: name })
  }

  static getAll() {
    return AlbumsModel.find();
  }

  static getAllbyGenre(genre_id) {
    return AlbumsModel.find({ genre_id: genre_id });
  }

  static getAllbyArtist(artist_id) {
    return AlbumsModel.find({ artist_id: artist_id });
  }

  static create(name, date_released, artist_id, genre_id) {
    const newAlbums = new AlbumsModel({
      name: name,
      date_released: date_released,
      artist_id: artist_id,
      genre_id: genre_id,
    })
    return newAlbums.save()
  }


  static delete(id) {
    return AlbumsModel.findByIdAndDelete(id)

  }

  static update(id, name, date_released, artist_id, genre_id) {
    const updateparams = { name: name, date_released: date_released, artist_id: artist_id, genre_id: genre_id }

    return AlbumsModel.findByIdAndUpdate({ _id: id },
      updateparams, { new: true })
  }


}
module.exports = Albums
