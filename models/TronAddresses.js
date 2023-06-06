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
    default: new Date()
}
const boolConfig = {
    type: Boolean,
    required: true
}

const TronAddressesModel = new Schema({
    address: detailConfig,
    date_added: dateConfig,
})

const TronAddresses = mongoose.models.TronAddresses ||  mongoose.model('TronAddresses', TronAddressesModel)

module.exports = TronAddresses