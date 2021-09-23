const {Schema} = require('mongoose');
const mongoose = require('mongoose');

const ChartAskSchema = new Schema({
  price: '',
  quantity: '',
});

const ChartAsk = mongoose.model('chartask', ChartAskSchema)

module.exports = ChartAsk;