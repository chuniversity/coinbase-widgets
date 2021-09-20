import React, { useState, useEffect, useRef } from "react";
import BestAsk from "./components/BestAsk";
import BestBid from "./components/BestBid";
import BidChart from "./components/BidChart";


import './App.css';



function App() {
  const [currencyPair, setCurrencyPair] = useState('');
  const [curAsk, setCurAsk] = useState('');
  const [curBid, setCurBid] = useState('');
  const [askData, setAskData] = useState([]);
  const [bidData, setBidData] = useState([]);
  const [timeData, setTimeData] = useState([]);


  useEffect(() => {
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

    //set flags
    let nextFlag = true;
    let bidFlag = false;
    let askFlag = false;
    ws.onmessage = msg => {
      let data = JSON.parse(msg.data)
      if(data.type === 'snapshot') {
        setCurAsk(data.asks[0]);
        setCurBid(data.bids[0]);
      } else if (data.type === 'l2update') {
        // begin calculate second
        let time = data.time.substr(data.time.indexOf('.') + 1, 1);
        if(nextFlag && Number(time) === 0) { bidFlag = true; askFlag = true; nextFlag = false; }
        if(Number(time) === 1) { nextFlag = true }
        //end calculate second
        let tuple = [];
        tuple.push(data.changes[0][1]);
        tuple.push(data.changes[0][2]);
        if(bidFlag && data.changes[0][0] === 'buy') {
          setCurBid(tuple);
          console.log('buy', time, tuple)
          let temp = bidData;
          temp.push(data.changes[0][1]);
          setBidData(temp)
          bidFlag = false;
        } else if (askFlag && data.changes[0][0] === 'sell') {
          console.log('sell', time, tuple)
          setCurAsk(tuple);
          let temp = askData;
          temp.push(data.changes[0][1]);
          setAskData(temp);
          askFlag = false;
        }
      } 
    };
    ws.onclose = () => {
      console.log('disconnected')
      }
  }, []);

  function handleSelect (cur) {
    setCurrencyPair(cur);
  }

  return (
    <div className="App">
      <header className="header">
        Select a Currency Pair
      </header>
      <div className="form-container">
        <select onChange={e => handleSelect(e.target.value)}>
        <option value=''></option>
          <option value="BTC-USD">BTC-USD</option>
          <option value="ETH-USD">ETH-USD</option>
          <option value="LTC-USD">LTC-USD</option>
          <option value="BCH-USD">BCH-USD</option>
        </select>
      </div>

      <div className="chart-cont">
        <div className="bid-ask-cont">
          <BestBid curBid={curBid} />
          <BestAsk curAsk={curAsk} />
        </div>
        <BidChart askData={askData} bidData={bidData}  />
      </div>
    </div>
  );
}

export default App;
