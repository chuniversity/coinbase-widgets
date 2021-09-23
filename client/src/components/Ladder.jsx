import React, { useState } from "react";


function Ladder() {

  const [agg, setAgg] = useState(.01);

  let aggMap = [.01, .05, .10, .25]

  function handleDec () {
    if(agg > .01) {
      let idx = aggMap.indexOf(agg) - 1;
      setAgg(aggMap[idx]);
    }
  }

  function handleInc () {
    if(agg < .25) {
      let idx = aggMap.indexOf(agg) + 1;
      console.log(idx);
      setAgg(aggMap[idx]);
    }
  }
  
  return (
    <div className="ladder-cont">
    <div className="buttons-cont">
     <button onClick={handleDec}> Dec - </button>
     <button onClick={handleInc}> Inc + </button>
    </div>
    </div>

  );
}

export default Ladder;