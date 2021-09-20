import React, { useEffect } from "react";

function BestBid({ curBid }) {

  return (
    <div className="bid-box">
      <div className="bid-title-box">
      <div className="bid-title">Best Bid: </div>
     </div>
      <div className="bid-content-cont">
        <div className="bid-price-cont">
          <div className="bid-price">{curBid[0]}</div>
          <div className="bid-price-text">Bid Price</div>
        </div>
        <div className="bid-quantity-cont">
          <div className="bid-quantity">{curBid[1]}</div>
          <div className="bid-quantity-text">Bid Quantity</div>
        </div>
      </div>
    </div>
  );
}

export default BestBid;