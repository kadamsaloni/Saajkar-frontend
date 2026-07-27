import "./Login.css";
import registerLogo from "../assets/register-logo.jpg";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="login-card">

        <img
          src={registerLogo}
          alt="Login"
          className="top-image"
        />

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