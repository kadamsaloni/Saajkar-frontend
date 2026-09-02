import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">

            <div className="footer-container">

                {/* ============================= */}
                {/* LOGO SECTION */}
                {/* ============================= */}

                <div className="footer-section">

                    <h2 className="footer-logo">
                        SAAJKAR
                    </h2>

                    <p className="footer-tagline">
                        Crafting Elegance That Lasts Forever.
                    </p>

                </div>


                {/* ============================= */}
                {/* QUICK LINKS */}
                {/* ============================= */}

                <div className="footer-section">

                    <h3>
                        Quick Links
                    </h3>

                    <ul>

                        <li>
                            <Link to="/">
                                Home
                            </Link>
                        </li>

                        <li>
                            <Link to="/about">
                                About
                            </Link>
                        </li>

                        <li>
                            <Link to="/collection">
                                Collection
                            </Link>
                        </li>

                        <li>
                            <Link to="/customization">
                                Customization
                            </Link>
                        </li>

                    </ul>

                </div>


                {/* ============================= */}
                {/* COLLECTIONS */}
                {/* ============================= */}

                <div className="footer-section">

                    {/* NOT CLICKABLE */}
                    <h3>
                        Collections
                    </h3>

                    <ul>

                        <li>
                            <Link to="/collection/rings">
                                Rings
                            </Link>
                        </li>

                        <li>
                            <Link to="/collection/necklaces">
                                Necklaces
                            </Link>
                        </li>

                        <li>
                            <Link to="/collection/earrings">
                                Earrings
                            </Link>
                        </li>

                        <li>
                            <Link to="/collection/bridal-sets">
                                Bridal Sets
                            </Link>
                        </li>

                    </ul>

                </div>


                {/* ============================= */}
                {/* CONTACT */}
                {/* ============================= */}

                <div className="footer-section">

                    <h3>
                        Contact
                    </h3>

                    <p>
                        📍 Mumbai, India
                    </p>

                    <p>
                        📞 +91 9867443783
                    </p>

                    <p>
                        ✉ saajkar13@gmail.com
                    </p>

                </div>

            </div>


            {/* ============================= */}
            {/* HORIZONTAL LINE */}
            {/* ============================= */}

            <hr />


            {/* ============================= */}
            {/* COPYRIGHT */}
            {/* ============================= */}

            <div className="footer-bottom">

                <p>
                    © 2026 Saajkar. All Rights Reserved.
                </p>

            </div>

        </footer>
    );
};

export default Footer;