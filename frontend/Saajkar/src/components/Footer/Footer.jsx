import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Logo */}
        <div className="footer-section">
          <h2 className="footer-logo">SAAJKAR</h2>
          <p className="footer-tagline">
            Crafting Elegance That Lasts Forever.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/collection">Collection</Link></li>
            <li><Link to="/customization">Customization</Link></li>
          </ul>
        </div>

        {/* Collections */}
        <div className="footer-section">
          <h3>Collections</h3>
          <ul>
            <li>Rings</li>
            <li>Necklaces</li>
            <li>Earrings</li>
            <li>Bridal Sets</li>
            
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>📍 Mumbai, India</p>
          <p>📞 +91 9867443783</p>
          <p>✉ saajkar13@gmail.com</p>
        </div>

      </div>

      <hr />

      <div className="footer-bottom">
        <p>© 2026 Saajkar. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;