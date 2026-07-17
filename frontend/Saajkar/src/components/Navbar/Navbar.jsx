import "./Navbar.css";

import logo from "../../assets/saajkar-logo.png";
import loginLogo from "../../assets/logo-for-login.jpg";

import { Search, Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {

const navigate=useNavigate();

return(

<nav className="navbar">

<div className="navbar-logo">

<img src={logo} alt="logo"/>

</div>

<div className="navbar-icons">

<Search
className="icon"
onClick={()=>navigate("/search")}
/>

<Heart
className="icon"
onClick={()=>navigate("/wishlist")}
/>

<ShoppingCart
className="icon"
onClick={()=>navigate("/cart")}
/>

<img
src={loginLogo}
className="login-logo"
onClick={()=>navigate("/login")}
/>

</div>

</nav>

)

}

export default Navbar;