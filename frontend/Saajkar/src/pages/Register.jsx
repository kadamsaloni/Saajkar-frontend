import "./Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/saajkar-logo.png";

function Register() {

  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handlePhoneChange = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhone(value);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
    }
  };


  const handleRegister = () => {

    if (phone === "" && otp === "") {
      setError("Phone number required and OTP required");
      return;
    }

    if (phone === "") {
      setError("Phone number required");
      return;
    }

    if (phone.length !== 10) {
      setError("Phone number must contain exactly 10 digits");
      return;
    }

    if (otp === "") {
      setError("OTP required");
      return;
    }

    setError("");
    alert("Registration successful");
  };


  return (
    <div className="register-container">

      <div className="register-card">

        <img src={logo} alt="Saajkar" className="register-logo" />

        <h2></h2>

        <p></p>


        <input
          type="tel"
          placeholder="Enter Mobile Number"
          value={phone}
          maxLength="10"
          onChange={handlePhoneChange}
        />


        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          maxLength="6"
          onChange={handleOtpChange}
        />


        {error && <p className="error">{error}</p>}


        <button 
          className="otp-btn"
          onClick={() => {
            if(phone.length !== 10){
              setError("Enter valid 10 digit mobile number");
            }
            else{
              setError("");
              alert("OTP sent successfully");
            }
          }}
        >
          Send OTP
        </button>


        <button 
          className="verify-btn"
          onClick={handleRegister}
        >
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