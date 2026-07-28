import "./Login.css";
import registerLogo from "../assets/register-logo.jpg";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
      setError("Email is required");
      return;
    }

    if (!emailPattern.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    if (password === "") {
      setError("Password is required");
      return;
    }

    setError("");
    alert("Login Successful");
  };


  return (
    <div className="container">

      <div className="login-card">

        <img
          src={registerLogo}
          alt="Login"
          className="top-image"
        />


        {error && (
          <p className="error-message">
            {error}
          </p>
        )}


        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />


        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />


        <div className="forgot">
          <a href="#">
            Forgot Password?
          </a>
        </div>


        <button 
          className="login-btn"
          onClick={handleLogin}
        >
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
          <Link to="/register">
            Register
          </Link>
        </div>


      </div>

    </div>
  );
}

export default Login;