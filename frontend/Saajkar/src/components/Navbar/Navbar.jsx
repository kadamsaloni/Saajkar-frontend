import "./Navbar.css";
import logo from "../../assets/saajkar-logo.png";
import loginLogo from "../../assets/logo-for-login.jpg";
import shopData from "../../data/shopData";

import { Search, Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  return (

    <nav className="navbar">

      {/* Logo */}

      <div className="navbar-logo">

        <img src={logo} alt="Saajkar Logo" />

      </div>


      {/* Navigation */}

      <ul className="navbar-links">

        <li onClick={() => navigate("/")}>HOME</li>

        <li className="shop-menu">

          SHOP ▾

          <div className="dropdown">

            {shopData.map((item) => (

              <div className="dropdown-column" key={item.title}>

                <h4>{item.title}</h4>

                {item.subCategories.map((sub) => (

                  <p key={sub}>{sub}</p>

                ))}

              </div>

            ))}

          </div>

        </li>

        <li>NEW ARRIVALS</li>

        <li>BRIDAL COLLECTION</li>

        <li>BEST SELLERS</li>

      </ul>


      {/* Icons */}

      <div className="navbar-icons">

        <Search
          className="icon"
          onClick={() => navigate("/search")}
        />

        <Heart
          className="icon"
          onClick={() => navigate("/wishlist")}
        />

        <ShoppingCart
          className="icon"
          onClick={() => navigate("/cart")}
        />

        <img
          src={loginLogo}
          alt="Login"
          className="login-logo"
          onClick={() => navigate("/login")}
        />

      </div>

    </nav>

  );

}

export default Navbar;