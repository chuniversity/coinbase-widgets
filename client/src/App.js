import React, { useState, useEffect, useRef } from "react";
import BestAsk from "./components/BestAsk";
import BestBid from "./components/BestBid";

import './App.css';



function App() {
  const [currencyPair, setCurrencyPair] = useState('');
  const [curAsks, setCurAsks] = useState([]);
  const [curBids, setCurBids] = useState([]);
  const [curAsk, setCurAsk] = useState('');
  const [curBid, setCurBid] = useState('');

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

    let counter = 0;
    ws.onmessage = msg => {
      counter++;
      let data = JSON.parse(msg.data)
      if(data.type === 'snapshot') {
        console.log('asks:', data.asks[0])
        console.log('bids:', data.bids[0])
        setCurAsk(data.asks[0]);
        setCurBid(data.bids[0]);
      } else if (data.type === 'l2update' && counter % 1000 === 0) {
        console.log('counter', counter )
        let tuple = [];
        tuple.push(data.changes[0][1]);
        tuple.push(data.changes[0][2]);
        if(data.changes[0][0] === 'buy') {
          setCurBid(tuple);
        } else if (data.changes[0][0] === 'sell') {
          setCurAsk(tuple);
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
      </div>
    </div>
  );
}

export default App;
