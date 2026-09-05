import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api/api";
import "./AdminLogin.css";
import logo from "../assets/saajkar-logo.png";

function AdminLogin() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        // Validation
        if (!email.trim()) {
            setError("Admin email is required");
            return;
        }

        if (!password) {
            setError("Password is required");
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email.trim(),
                        password
                    })
                }
            );

            const data = await response.json();

            console.log("Admin Login Response:", data);

            if (!response.ok) {
                setError(
                    data.message || "Invalid email or password"
                );
                return;
            }

            // Check whether the logged-in user is an admin
            if (!data.user || data.user.role !== "admin") {

                setError(
                    "Access denied. Admin account required."
                );

                return;
            }

            // Save admin authentication
            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            // Go to Admin Dashboard
            navigate("/admin");

        } catch (error) {

            console.error(
                "Admin Login Error:",
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

        <div className="admin-login-page">

            <div className="admin-login-card">

                {/* Logo */}

                <img
                    src={logo}
                    alt="Saajkar Logo"
                    className="admin-logo"
                />

                {/* Heading */}

                <h1>Admin Login</h1>

                <p className="admin-subtitle">
                    Welcome to Saajkar Admin Panel
                </p>

                {/* Error */}

                {error && (
                    <div className="admin-error">
                        {error}
                    </div>
                )}

                {/* Login Form */}

                <form onSubmit={handleLogin}>

                    {/* Email */}

                    <div className="admin-input-group">

                        <label>
                            Admin Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter admin email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                    </div>

                    {/* Password */}

                    <div className="admin-input-group">

                        <label>
                            Password
                        </label>

                        <div className="password-box">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter admin password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />

                            <button
                                type="button"
                                className="show-password"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>

                        </div>

                    </div>

                    {/* Login Button */}

                    <button
                        type="submit"
                        className="admin-login-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Admin Login"
                        }
                    </button>

                </form>

                {/* Back Home */}

                <button
                    className="admin-home-btn"
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </button>

            </div>

        </div>

    );
}

export default AdminLogin;