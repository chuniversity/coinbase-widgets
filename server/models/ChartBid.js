const {Schema} = require('mongoose');
const mongoose = require('mongoose');

const ChartBidSchema = new Schema({
  price: '',
  quantity: '',
});

const ChartBid = mongoose.model('chartbid', ChartBidSchema)

module.exports = ChartBid;