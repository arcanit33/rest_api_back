const mongoose = require("mongoose")

const GenreSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
})


const GenreModel = mongoose.model("Genre", GenreSchema)

class Genre {
  constructor(name) {
    this.name = name
  }

  static find(name) {
    return GenreModel.findOne({ name: name })
  }

  static getAll() {
    return GenreModel.find();
  }

  static getName(_id) {
    return GenreModel.findById(_id)
  }

  static create(name) {
    const newGenre = new GenreModel({
      name: name
    })
    return newGenre.save()
  }


  static delete(id) {
    return GenreModel.findByIdAndDelete(id)

  }

  static update(id, name) {
    const updateparams = { name: name }

    return GenreModel.findByIdAndUpdate({ _id: id },
      updateparams, { new: true })
  }

}
module.exports = Genre
