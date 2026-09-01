import "./Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/saajkar-logo.png";
import API_URL from "../api/api";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);


    const handleRegister = async () => {

        setError("");
        setSuccess("");


        // Validation
        if (!name || !email || !password || !confirmPassword) {
            setError("Please fill all fields");
            return;
        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            setError("Enter a valid email address");
            return;
        }


        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }


        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }


        try {

            setLoading(true);


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
                        password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                setError(
                    data.message ||
                    "Registration failed"
                );

                return;
            }


            console.log("Registration successful:", data);


            setSuccess(
                "Registration successful! Redirecting to login..."
            );


            // Go to login after registration
            setTimeout(() => {
                navigate("/login");
            }, 1500);


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            setError(
                "Unable to connect to server"
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
                    alt="Saajkar"
                    className="register-logo"
                />


                <h2>
                    Create Account
                </h2>

                <p>
                    Register to continue
                </p>


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


                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}


                {success && (
                    <p className="success">
                        {success}
                    </p>
                )}


                <button
                    className="verify-btn"
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

            </div>

        </div>

    );
}

export default Register;