import "./Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/saajkar-logo.png";

function Register() {

  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <div className="register-container">

      <div className="register-card">

        <img src={logo} alt="Saajkar" className="register-logo" />

        <h2>Create Account</h2>

        <p>
          Register using your mobile number.
        </p>

        <input
          type="tel"
          placeholder="Enter Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button className="otp-btn">
          Send OTP
        </button>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="verify-btn">
          Verify OTP
        </button>

        <button
          className="back-btn"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>

      </div>

    </div>
  );
}

export default Register;