const express = require("express");
const WebSocket = require('ws');
const startMongo = require("./server/mongoConnect");

const router = require('./server/routes');
const ChartData = require('./server/models/ChartData');

const PORT = process.env.PORT || 4008;
const app = express();

app.use(express.json());
app.use(express.static(__dirname + './client/public'));
app.use(router);

const startServer = async () => {
  await startMongo()
  app.listen(4008, () => {
    console.log(`listening on port 4008`)
  });
}

startServer();








// begin web socket
const ws = new WebSocket("wss://ws-feed.pro.coinbase.com");

ws.onopen = () => {
  ws.send(
    JSON.stringify({
      "type": "subscribe",
      "product_ids": [
          "BTC-USD"
          // "ETH-USD",
          // "LTC-USD",
          // "BCH-USD"
      ],
      "channels": [
          "level2"
      ]
  })
  );
};

ws.onmessage = msg => {
  let data = JSON.parse(msg.data)
  const collId = "614ab8790fc35dfd9118fa56";
  if(data.type === 'snapshot') {
    console.log('snapshot')
    
    let myquery = { _id: collId }
    let newvalues = { $set: {bid: data.bids, ask: data.asks } };
    ChartData.updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("document updated")
    });
  } else if (data.type === 'l2update') {
    if(Number(data.changes[0][2]) === 0) {
      if(data.changes[0][0] === 'buy') {
        ChartData.updateOne( { _id: collId }, { $pull: { bid: { $elemMatch: { $eq: data.changes[0][1] } } } }, function (err, res) {
          if (err) throw err;
          });
      } else if (data.changes[0][0] === 'sell') {
        ChartData.updateOne( { _id: collId }, { $pull: { sell: { $elemMatch: { $eq: data.changes[0][1] } } } }, function (err, res) {
          if (err) throw err;
          });
      }
    } else {
      let tuple = [[data.changes[0][1], data.changes[0][2]]];
      if(data.changes[0][0] === 'buy') {
        ChartData.find( {bid: { $elemMatch: { $elemMatch: {$eq: data.changes[0][1]} } } })
          .then(doc => {
          if (doc.length) { // if item is present, remove this old item
        ChartData.updateOne( { _id: collId }, { $pull: { bid: { $elemMatch: { $eq: data.changes[0][1] } } } }).catch(err => {console.error(err)});
          } // push new item
        ChartData.updateOne( { _id: collId }, {$push : { bid: tuple }} ).catch(err => {console.error(err)});
          });
      } else if (data.changes[0][0] === 'sell') {
        ChartData.find( {ask: { $elemMatch: { $elemMatch: {$eq: data.changes[0][1]} } } })
        .then(doc => {
        if (doc.length) { // if item is present, remove this old item and push new one
          ChartData.updateOne( { _id: collId }, { $pull: { ask: { $elemMatch: { $eq: data.changes[0][1] } } } }).catch(err => {console.error(err)});
        } // push new item
          ChartData.updateOne( { _id: collId }, {$push : { ask: tuple }} ).catch(err => {console.error(err)});
        
        });
      }

    }

    // console.log(data.changes[0][1])d
  }
}



//end websocket



module.exports = app;