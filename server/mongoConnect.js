const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const config = require('../config.js');


const mongoUrl = `mongodb+srv://${config.user}:${config.pass}@${config.dbRoute}`;

const startMongo = async () => {
  const opt = {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  }
  const db = mongoose.connection;
  db.on("connected", () => {
    console.log("Connected to db");
  });
  await mongoose.connect(mongoUrl, opt);

}







module.exports = startMongo;