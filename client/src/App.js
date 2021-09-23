import React, { useState, useEffect, useRef } from "react";
import BestAsk from "./components/BestAsk";
import BestBid from "./components/BestBid";
import BidChart from "./components/BidChart";
import Ladder from "./components/Ladder";

import './App.css';

function App() {
  const [currencyPair, setCurrencyPair] = useState('');
  const [curAsk, setCurAsk] = useState('');
  const [curBid, setCurBid] = useState('');
  const [isChartFull, setIsChartFull] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);
  const [bidsUpdates, setBidsUpdates] = useState([]);

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

    ws.onmessage = msg => {
      let data = JSON.parse(msg.data)
      if(data.type === 'snapshot') {
        setCurBid(data.bids[0]);
        setCurAsk(data.asks[0]);
        console.log('first test', curBid)
        setAsks(data.asks);
        setBids(data.bids);
      } else if (data.type === 'l2update') {
        if(data.changes[0][0] === 'buy') {
         if(Number(data.changes[0][2]) === 0) {
          handleRemoveItem(data.changes[1])
         } else {
          let newValue = [data.changes[0][1], data.changes[0][2]]
          setBids(prevArray => [...prevArray, newValue])
          // if(data.changes[0][1] > curBid) { setCurBid(newValue)}
         }
        } else if (data.changes[0][0] === 'sell') {

        }
      } 
    };
    ws.onclose = () => {
      console.log('disconnected')
      }
  }, []);

  function handleRemoveItem (val) {
    setBids(bids.filter(item => item[0] !== val))
  }



  function handleSelect (cur) {
    setCurrencyPair(cur);
  }
  function feedDataHandler () {
    console.log(bids)
  }
  function firstBidHandler () {
    console.log(bids[0])
  }
  function curBidHandler () {
    console.log(curBid)
  }
  

  return (
    <div className="App">
      <header className="header">
        <h1>Select a Currency Pair</h1>
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
        <div className="chart-title">Real Time Chart</div>

        <div className="bid-ask-cont">
          <BestBid curBid={curBid} />
          <BestAsk curAsk={curAsk} />
        </div>
        {/* <BidChart chartData={chartData} isChartFull={isChartFull} /> */}
        <button onClick={feedDataHandler}>Feed Data</button>
        <button onClick={firstBidHandler}>First Bid</button>
        <button onClick={curBidHandler}>curBid</button>
      </div>
      <Ladder />
    </div>
  );
}

export default App;
