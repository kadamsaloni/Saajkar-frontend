import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

import logo from "../../assets/saajkar-logo.png";
import loginLogo from "../../assets/logo-for-login.jpg";

import Filter from "../Filter/Filter";

import {
    FaBars,
    FaSearch,
    FaHeart,
    FaShoppingBag
} from "react-icons/fa";


const Navbar = () => {

    const [showFilter, setShowFilter] = useState(false);

    return (
        <header className="navbar">

            {/* ================= TOP NAVBAR ================= */}

            <div className="top-navbar">

                {/* Empty Space */}
                <div className="empty-space"></div>


                {/* LOGO */}
                <div className="logo">

                    <Link to="/">
                        <img
                            src={logo}
                            alt="Saajkar Logo"
                        />
                    </Link>

                </div>


                {/* NAVIGATION ICONS */}
                <div className="nav-icons">

                    {/* Search */}
                    <Link to="/search">
                        <FaSearch />
                    </Link>


                    {/* Wishlist */}
                    <Link to="/wishlist">
                        <FaHeart />
                    </Link>


                    {/* Cart */}
                    <Link to="/cart">
                        <FaShoppingBag />
                    </Link>


                    {/* Login */}
                    <Link to="/login">
                        <img
                            src={loginLogo}
                            alt="Login"
                            className="login-logo"
                        />
                    </Link>

                </div>

            </div>


            {/* ================= MENU BAR ================= */}

            <nav className="menu">

                {/* Filter */}
                <button
                    type="button"
                    className="filter-btn"
                    onClick={() => setShowFilter(true)}
                >
                    <FaBars />

                    <span>
                        Filter
                    </span>
                </button>


                {/* Home */}
                <Link to="/">
                    Home
                </Link>


                {/* Shop */}
                <Link to="/shop">
                    Shop ▼
                </Link>


                {/* New Arrival */}
                <Link to="/new-arrival">
                    New Arrival
                </Link>


                {/* About */}
                <Link to="/about">
                    About
                </Link>


                {/* Best Seller */}
                <Link to="/best-sellers">
                    Best Seller
                </Link>


                {/* Customization */}
                <Link to="/customization">
                    Customization
                </Link>


                {/* Jewellery Care */}
                <Link to="/jewellery-care">
                    Jewellery Care
                </Link>

            </nav>


            {/* ================= FILTER ================= */}

            {showFilter && (
                <Filter
                    closeFilter={() => setShowFilter(false)}
                />
            )}

        </header>
    );
};


export default Navbar;