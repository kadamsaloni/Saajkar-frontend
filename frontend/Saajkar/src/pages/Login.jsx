import "./Login.css";
import registerLogo from "../assets/register-logo.jpg";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import API_URL from "../api/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {

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
        setLoading(true);

        try {

            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login failed");
                return;
            }

            // Save login information
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            console.log("Login successful:", data);

            // Go to home page
            navigate("/");

        } catch (error) {

            console.error("Login Error:", error);
            setError("Unable to connect to server. Please try again.");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

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
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
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