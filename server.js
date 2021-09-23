const express = require("express");
const WebSocket = require('ws');
const startMongo = require("./server/mongoConnect");

const router = require('./server/routes');
const ChartData = require('./server/models/ChartData');

const PORT = process.env.PORT || 4005;
const app = express();

app.use(express.json());
app.use(express.static(__dirname + './client/public'));
app.use(router);

const startServer = async () => {
  await startMongo()
  app.listen(4005, () => {
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
      //if item matches this criteria (that is quantity === 0) we want to remove this item from the database. 

      // this code is trying to find the item, but can't match the inner array, it's trying to match the whole tuple
      ChartData.updateOne( { _id: "614ab8790fc35dfd9118fa56" }, { $pull: { bid: { $in: data.changes[0][1] } } } )
  
  
    } else {
      let tuple = [data.changes[0][1], data.changes[0][2]]

    }

    // console.log(data.changes[0][1])d
  }
}



//end websocket



module.exports = app;