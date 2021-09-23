const express = require("express");
const WebSocket = require('ws');
const startMongo = require("./server/mongoConnect");

const router = require('./server/routes');
const ChartData = require('./server/models/ChartData');

const PORT = process.env.PORT || 4007;
const app = express();

app.use(express.json());
app.use(express.static(__dirname + './client/public'));
app.use(router);

const startServer = async () => {
  await startMongo()
  app.listen(4007, () => {
    console.log(`listening on port 4002`)
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
      let tuple = [data.changes[0][1], data.changes[0][2]];
      if(data.changes[0][0] === 'buy') {


        // if the item ([data.changes[0][1]) is present in the bids array, update the quantity (data.changes[0][2]])
          // if the item is not pretty in the bids array, add the item and quanity (the tuple) to the array. 

      } else if (data.changes[0][0] === 'sell') {

      }

    }

    // console.log(data.changes[0][1])d
  }
}



//end websocket



module.exports = app;