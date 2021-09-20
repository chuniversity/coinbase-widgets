import React from 'react';

function BestAsk({curAsk}) {
  return (
    <div className="bid-box">
      <div className="ask-title-box">
      <div className="bid-title">Best Ask: </div>
     </div>
      <div className="bid-content-cont">
        <div className="bid-price-cont">
          <div className="bid-price">{curAsk[0]}</div>
          <div className="bid-price-text">Ask Price</div>
        </div>
        <div className="Ask-quantity-cont">
          <div className="bid-quantity">{curAsk[1]}</div>
          <div className="bid-quantity-text">Ask Quantity</div>
        </div>
      </div>
    </div>
  );
}

export default BestAsk;