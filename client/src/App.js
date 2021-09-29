import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import BestAsk from "./components/BestAsk";
import BestBid from "./components/BestBid";
import BidChart from "./components/BidChart";
import Ladder from "./components/Ladder";

import './App.css';

function App() {
  const [currencyPair, setCurrencyPair] = useState('');
  const [curAsk, setCurAsk] = useState('');
  const [curBid, setCurBid] = useState('');
  const [curAskData, setCurAskData] = useState([[0,0]]);
  const [curBidData, setCurBidData] = useState([[0,0]]);
  const curBidDataRef = useRef(curBidData)



  const [curBidHist, setCurBidHist] = useState('');
  const [curAskHist, setCurAskHist] = useState('');
  const [isChartFull, setIsChartFull] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);
  const [bidsUpdates, setBidsUpdates] = useState([]);
  const [dataRec, setDataRec] = useState(false);
  const dataRecRef = useRef(dataRec)

  
  useEffect(
    () => { dataRecRef.current = dataRec },
    [dataRec]
  )

  useEffect(
    () => { curBidDataRef.current = curBidData },
    [curBidData]
  )
  

  function handleSelect (e) {
    const ws = new WebSocket("wss://ws-feed.pro.coinbase.com");
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          "type": "subscribe",
          "product_ids": [
            e
          ],
          "channels": [
              "level2"
          ]
      })
      );
    };

    ws.onmessage = msg => {
    let data = JSON.parse(msg.data)
    if(data.type === 'snapshot') {
      let bidTemp = [];
      let askTemp = [];
      for(let i = 1; i < 50; i++){
        bidTemp.push(data.bids[i]);
        askTemp.push(data.asks[i]);
      }
      setCurBidData(data.bids);
      setCurAskData(askTemp);
    } else if (data.type === 'l2update') {
      if(Number(data.changes[0][2]) === 0) {
        if(data.changes[0][0] === 'buy') {
          let newbidvalues = [...curBidDataRef.current];
          for (let i = 0; i < newbidvalues.length; i++) {
            if(data.changes[0][1] === newbidvalues[i][0]) {
              newbidvalues.splice(i,1);
              break;
            }
          }
          setCurBidData(newbidvalues);


        } else if (data.changes[0][0] === 'sell') {
          let newaskvalues = [...curAskData];
          // for (let i = 0; i < newaskvalues.length; i++) {
          //   if(data.changes[0][1] === newaskvalues[i][0]) {
          //     newaskvalues.splice(i,1);
          //     break;
          //   }
          // }
        }
    } else {
      if (data.changes[0][0] === 'buy') {
        let tuple = [data.changes[0][1], data.changes[0][2]];
        let newbidvalues = [...curBidDataRef.current];
        if(data.changes[0][1] > newbidvalues[0][0]){
          newbidvalues.unshift(tuple)
        } else {
          if(newbidvalues[0][0] !== undefined) {
            for (let i = 0; i < newbidvalues.length; i++) {
              if(data.changes[0][1] > newbidvalues[i][0] && data.changes[0][1] < newbidvalues[i + 1][0]){
                newbidvalues.splice(i+1,0,tuple);
                break;
              }
            }
          }
        }
        setCurBidData(newbidvalues)
      } else if (data.changes[0][0] === 'sell')  {
        // let tuple = [data.changes[0][1], data.changes[0][2]];
        // let newaskvalues = [...curAskData];
        // if(data.changes[0][1] > newaskvalues[0][0]){
        //   newaskvalues.unshift(tuple)
        // } else {
        //   let placed = false;
        //   for (let i = 0; i < newaskvalues.length; i++) {
        //     if(data.changes[0][1] > newaskvalues[i] && data.changes[0][1] < newaskvalues[i + 1]){
        //       placed = true;
        //       newaskvalues.splice(i+1,0,tuple);
        //       break;
        //     }
        //   }
        //   if (!placed) {
        //     newaskvalues.push(tuple);
        //   }
        // }
        // setCurAskData(newaskvalues);     
      }
    }
  }
}
  //end onmessage
    
    setCurrencyPair(e)
    // let obj = {};
    // obj.currency = e;
    // axios.post('/connect', obj)
    // .then(data => {
    //   console.log('data sent')
    //   setDataRec(true)
    // })
    // .catch(err => {
    //   console.log(err)
    // });
  }

  function getHighest () {
    // if(dataRecRef.current === true) {
    //   axios.get('/gethighest')
    //   .then(data => {
    //     console.log('success')
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   });
    // }
  }


 
//   useEffect(() => {
//     getHighest()
//     setInterval(() => getHighest(), 1000)
    
// }, [])

//testing functions

function getCurBidData () {
  console.log('button: curBidData', curBidData)
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
          <BestBid curBid={curBidData[0]} />
          <BestAsk curAsk={curAskData[0]} />
        </div>
        {/* <BidChart chartData={chartData} isChartFull={isChartFull} /> */}
        <button onClick={getHighest}>Get Highest</button>
        <button onClick={getCurBidData}>Get curBidData</button>
      </div>
      <Ladder />
    </div>
  );
}

export default App;
