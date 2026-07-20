import "./Login.css";
import logo from "../assets/saajkar-logo.png";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="container">

      <div className="login-card">

        <img src={logo} alt="Saajkar" className="logo" />

        <h2></h2>

        <p className="tagline">
         
        </p>

        <input
          type="email"
          placeholder="Email Address"
        />

        <input
          type="password"
          placeholder="Password"
        />

        <div className="forgot">
          <a href="#">Forgot Password?</a>
        </div>

        <button className="login-btn">
          Login
        </button>

        <button
          className="home-btn"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>

        <div className="register">
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </div>

      </div>

    </div>
  );
}

export default Login;