import React from "react";
import "./NewArrival.css";

const NewArrival = () => {
  return (
    <div className="new-arrival-page">

      {/* New Arrival Banner */}
      <section className="new-arrival-banner">

        <div className="new-arrival-overlay">

          <p className="arrival-small">
            ✦ SAajkar presents ✦
          </p>

          <h1>NEW ARRIVALS</h1>

          <div className="arrival-line"></div>

          <p className="arrival-message">
            Something beautiful has just arrived.
          </p>

          <p className="arrival-description">
            Discover our latest collection of elegant jewellery,
            thoughtfully designed to celebrate your special moments.
          </p>

          <button className="arrival-button">
            EXPLORE NOW
          </button>

        </div>

      </section>


      {/* Notification */}
      <section className="arrival-notification">

        <div className="notification-icon">
          ✦
        </div>

        <div className="notification-content">
          <span>JUST IN</span>

          <h2>
            New Jewellery Collection Has Arrived
          </h2>

          <p>
            Stay tuned for our newest designs, traditional
            treasures and timeless pieces.
          </p>
        </div>

      </section>

    </div>
  );
};

export default NewArrival;