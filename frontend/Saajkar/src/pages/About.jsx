import React from "react";
import "./About.css";

import aboutBanner from "../assets/about-banner.jpg";

const About = () => {
  return (
    <div className="about-page">

      {/* About Banner */}
      <section
        className="about-banner"
        style={{ backgroundImage: `url(${aboutBanner})` }}
      >
        <div className="banner-overlay">
          <h1></h1>
          <p>
            
          </p>
        </div>
      </section>


      {/* About Content */}
      <section className="about-content">

        <div className="about-text">

          <h2>
            Our Story
          </h2>

          <p>
            Saajkar is a renowned jewellery brand inspired by
            India's rich heritage and traditional craftsmanship.
            We create elegant pieces that blend royal designs
            with modern fashion.
          </p>

          <p>
            Every jewellery piece at Saajkar is carefully crafted
            to celebrate beauty, emotions, and unforgettable moments.
            Our aim is to provide premium quality jewellery with
            timeless elegance.
          </p>

        </div>


        <div className="about-card">

          <h3>
            Why Choose Saajkar?
          </h3>

          <ul>
            <li>✨ Traditional Craftsmanship</li>
            <li>✨ Traditional Indian designs</li>
            <li>✨ High quality materials</li>
            <li>✨ Elegant luxury experience</li>
          </ul>

        </div>

      </section>


    </div>
  );
};

export default About;