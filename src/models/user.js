const mongoose = require("mongoose")
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  role: { type: Number, default: 0 },
  password: { type: String, required: true },
})


const UserModel = mongoose.model("User", UserSchema)

class User {
  constructor(login, role, password) {
    this.login = login
    this.role = role
    this.password = password
  }
  static getAll() {
    return UserModel.find();
  }

  static find(login) {
    return UserModel.findOne({ login: login })
  }

  static async isUserPasswordCorrect(login, password) {
    let userDoc = await UserModel.findOne({ login: login })

    if (userDoc) {
      let passwordHash = userDoc.password

      let passwordsMatched = await bcrypt.compare(password, passwordHash);
      return passwordsMatched
    }
  }

  static async create(login, role, password) {
    let passHash = await bcrypt.hash(password, 10)
    const newUser = new UserModel({
      login: login,
      role: role,
      password: passHash
    })

    return newUser.save()
  }

  static delete(id) {
    return UserModel.findByIdAndDelete(id)
  }

  static async update(id, login, role, password) {
    let passHash
    if (password == null || password == undefined) {
      passHash = null
    }
    else {
      passHash = await bcrypt.hash(password, 10)
    }
    const updateparams = { login: login, role: role, password: passHash }

    return UserModel.findByIdAndUpdate({ _id: id },
      updateparams, { new: true })
  }
}

module.exports = User
