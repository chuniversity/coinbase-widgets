const {Schema} = require('mongoose');
const mongoose = require('mongoose');

const ChartDataSchema = new Schema({
  bid: [],
  ask: [],
});

const ChartData = mongoose.model('chartdata', ChartDataSchema)

module.exports = ChartData;