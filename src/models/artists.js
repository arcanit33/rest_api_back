const mongoose = require("mongoose")

const ArtistsSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  age: { type: Number, require: true }
})


const ArtistsModel = mongoose.model("Artists", ArtistsSchema)

class Artists {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  static find(name) {
    return ArtistsModel.findOne({ name: name })
  }

  static getAll() {
    return ArtistsModel.find();
  }

  static getName(_id) {
    return ArtistsModel.findById(_id)
  }

  static create(name, age) {
    const newArtists = new ArtistsModel({
      name: name,
      age: age,
    })
    return newArtists.save()
  }

  static delete(id) {
    return ArtistsModel.findByIdAndDelete(id)

  }

  static update(id, name, age) {
    const updateparams = { name: name, age: age }

    return ArtistsModel.findByIdAndUpdate({ _id: id },
      updateparams, { new: true })
  }

}
module.exports = Artists
