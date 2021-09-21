import React from 'react';
import { Line } from 'react-chartjs-2';


function BidChart({ chartData, isChartFull}) {

  let bids = [];
  let times = [];
  let asks = [];
  for(let i = 0; i < chartData.length; i++) {
    times.push(chartData[i][0]);
    bids.push(chartData[i][1]);
    asks.push(chartData[i][2]);
  }
  if(!isChartFull) {
    let first = times[0]
    times = [];
    for (let i = 0; i <= 60; i++) {
      times.push(first + i)
    }
  }
  // console.log(bids.length, askData.length )

  const data = {
    labels: times,
    datasets: [
      {
        label: 'Ask Price',
        data: asks,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        tension: .2,
      },
      {
        label: 'Bid Price',
        data: bids,
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      animations: {
        tension: {
          duration: 1000,
          easing: 'linear',
          from: 1,
          to: 0,
          loop: true
        }
      },
    }
  };



  return (
    <div className="bid-chart">
        <Line data={data} options={options} />
    </div>
  );
}

export default BidChart;
