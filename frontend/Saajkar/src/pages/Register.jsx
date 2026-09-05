import "./Register.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/saajkar-logo.png";
import API_URL from "../api/api";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {

        setError("");
        setSuccess("");

        // Check empty fields
        if (
            !name ||
            !email ||
            !phone ||
            !password ||
            !confirmPassword
        ) {
            setError("Please fill all fields");
            return;
        }

        // Email validation
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            setError("Enter a valid email address");
            return;
        }

        // Phone validation
        const phonePattern = /^[0-9]{10}$/;

        if (!phonePattern.test(phone)) {
            setError("Enter a valid 10-digit phone number");
            return;
        }

        // Password validation
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        // Confirm password
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                `${API_URL}/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        phone,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setError(
                    data.message || "Registration failed"
                );

                return;
            }

            setSuccess(
                "Registration successful! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            console.error(
                "Registration Error:",
                error
            );

            setError(
                "Unable to connect to server. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="register-container">

            <div className="register-card">

                <img
                    src={logo}
                    alt="Saajkar Logo"
                    className="register-logo"
                />

                <h2>Create Account</h2>

                <p className="register-subtitle">
                    Register to continue with Saajkar
                </p>

                {error && (
                    <p className="register-error">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="register-success">
                        {success}
                    </p>
                )}

                <input
                    type="text"
                    placeholder="Enter Your Name"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                />

                <input
                    type="email"
                    placeholder="Enter Email Address"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    type="tel"
                    placeholder="Enter Phone Number"
                    value={phone}
                    maxLength="10"
                    onChange={(e) =>
                        setPhone(
                            e.target.value.replace(/\D/g, "")
                        )
                    }
                />

                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(e.target.value)
                    }
                />

                <button
                    className="register-btn"
                    onClick={handleRegister}
                    disabled={loading}
                >
                    {loading
                        ? "Creating Account..."
                        : "Create Account"
                    }
                </button>

                <button
                    className="back-btn"
                    onClick={() => navigate("/login")}
                >
                    Back to Login
                </button>

                <div className="login-link">
                    
                    <Link to="/login">
                       
                    </Link>
                </div>

            </div>

        </div>
    );
}

export default Register;