import React, { useState, useEffect, useRef } from "react";

import logo from './logo.svg';
import './App.css';



function App() {
  // const url = "https://api.pro.coinbase.com";
  // const ws = useRef(null);

  // ws.current = new WebSocket("wss://ws-feed.pro.coinbase.com");

  // const ws = new WebSocket("wss://ws-feed.pro.coinbase.com")

 

  useEffect(() => {
    const ws = new WebSocket("wss://ws-feed.pro.coinbase.com");
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          "type": "subscribe",
          "product_ids": [
              "BTC-USD",
              "ETH-USD",
              "LTC-USD",
              "BCH-USD"
          ],
          "channels": [
              "level2"
          ]
      })
      );
    };

    ws.onmessage = msg => {
      console.log(JSON.parse(msg.data));
    };

  }, []);


  return (
    <div className="App">
      <header className="App-header">
        sup
      
      </header>
    </div>
  );
}

export default App;
