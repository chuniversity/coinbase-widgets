import React from 'react';
import { Line } from 'react-chartjs-2';


function BidChart({}) {
  

  const data = {
    // labels: dates,
    // datasets: [
    //   {
    //     label: city1,
    //     data: temps1,
    //     fill: false,
    //     backgroundColor: 'rgb(255, 99, 132)',
    //     borderColor: 'rgba(255, 99, 132, 0.2)',
    //     yAxisID: 'y-axis-1',
    //   },
    //   {
    //     label: city2,
    //     data: temps2,
    //     fill: false,
    //     backgroundColor: 'rgb(54, 162, 235)',
    //     borderColor: 'rgba(54, 162, 235, 0.2)',
    //     yAxisID: 'y-axis-1',
    //   },
    // ],
  };

  const options = {

  };



  return (
    <div className="bid-chart">
        <Line data={data} options={options} />

    </div>
  );
}

export default BidChart;
