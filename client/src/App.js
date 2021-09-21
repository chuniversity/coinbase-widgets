import React, { useState, useEffect, useRef } from "react";
import BestAsk from "./components/BestAsk";
import BestBid from "./components/BestBid";
import BidChart from "./components/BidChart";


import './App.css';



function App() {
  const [currencyPair, setCurrencyPair] = useState('');
  const [curAsk, setCurAsk] = useState('');
  const [curBid, setCurBid] = useState('');
  const [isChartFull, setIsChartFull] = useState(false);
  const [chartData, setChartData] = useState([]);

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
    let chartBidFlag = false;
    let chartDataHold = [];
    ws.onmessage = msg => {
      let data = JSON.parse(msg.data)
      if(data.type === 'snapshot') {
        setCurAsk(data.asks[0]);
        setCurBid(data.bids[0]);
      } else if (data.type === 'l2update') {
        // begin calculate second
        let second = data.time.substr(data.time.indexOf('.') + 1, 1);
        if(nextFlag && Number(second) === 0) { bidFlag = true; askFlag = true; nextFlag = false; }
        if(Number(second) === 1) { nextFlag = true }
        let time = new Date(data.time)
        let newTime = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
        if(bidFlag && data.changes[0][0] === 'buy') {
          let tuple = [];
          tuple.push(data.changes[0][1]);
          tuple.push(data.changes[0][2]);
          setCurBid(tuple);
          chartDataHold.push(newTime);
          chartDataHold.push(data.changes[0][1])
          bidFlag = false;
          chartBidFlag = true;
        } else if (chartBidFlag && askFlag && data.changes[0][0] === 'sell') {
          let tuple = [];
          tuple.push(data.changes[0][1]);
          tuple.push(data.changes[0][2]);
          setCurAsk(tuple);
          chartDataHold.push(data.changes[0][1]);
          askFlag = false;
        }
        if(chartDataHold.length === 3) {
          let chartDataTemp = chartData;
          chartDataTemp.push(chartDataHold);
          setChartData(chartDataTemp);
          chartDataHold = [];
          chartBidFlag = false;
          if(chartData.length >= 60) {
            setIsChartFull(true);
            chartData.shift();
          }
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
        <BidChart chartData={chartData} isChartFull={isChartFull} />
      </div>
    </div>
  );
}

export default App;
