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


      {/* TOP NAVBAR */}

      <div className="top-navbar">


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



        {/* ICONS */}

        <div className="nav-icons">


          <Link to="/search">
            <FaSearch />
          </Link>


          <Link to="/wishlist">
            <FaHeart />
          </Link>


          <Link to="/cart">
            <FaShoppingBag />
          </Link>


          <Link to="/login">

            <img
              src={loginLogo}
              alt="Login"
              className="login-logo"
            />

          </Link>


        </div>


      </div>





      {/* MENU BAR */}

      <nav className="menu">


        <button
          className="filter-btn"
          onClick={() => setShowFilter(true)}
        >

          <FaBars />

          <span>
            Filter
          </span>

        </button>



        <Link to="/">
          Home
        </Link>


        <Link to="/shop">
          Shop ▼
        </Link>


        <Link to="/new-arrival">
          New Arrival
        </Link>


        <Link to="/about">
          About
        </Link>


        <Link to="/best-sellers">
          Best Seller
        </Link>


      </nav>





      {/* FILTER */}

      {
        showFilter &&

        <Filter
          closeFilter={() => setShowFilter(false)}
        />

      }


    </header>

  );

};


export default Navbar;