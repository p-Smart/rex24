const mongoose = require('mongoose')
const { Schema } = mongoose;

const detailConfig = {
    type: String,
}
const numberConfig = {
    type: Number,
    default: 0
}
const dateConfig = {
    type: Date,
    default: new Date(new Date().setDate(new Date().getDate() - 1))
}
const boolConfig = {
    type: Boolean,
    default: false
}

const AccountsModel = new Schema({
    user_name: detailConfig,
    password: detailConfig,
    reg_date: dateConfig,
  })

const Accounts = mongoose.models.Accounts ||  mongoose.model('Accounts', AccountsModel)

module.exports = Accounts