import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api/api";

function AdminLogin() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Email and password are required");
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
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            console.log("Admin Login Response:", data);


            if (!response.ok) {

                setError(
                    data.message || "Login failed"
                );

                return;
            }


            // Check admin role
            if (data.user.role !== "admin") {

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


            // Go to admin dashboard
            navigate("/admin");


        } catch (error) {

            console.error(error);

            setError(
                "Unable to connect to server"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div>

            <h1>
                Admin Login
            </h1>


            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}


            <form onSubmit={handleLogin}>

                <div>

                    <label>
                        Admin Email
                    </label>

                    <br />

                    <input
                        type="email"
                        placeholder="Enter admin email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                </div>


                <br />


                <div>

                    <label>
                        Password
                    </label>

                    <br />

                    <input
                        type="password"
                        placeholder="Enter admin password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                </div>


                <br />


                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Logging in..."
                        : "Admin Login"
                    }
                </button>

            </form>


            <br />


            <button
                onClick={() => navigate("/")}
            >
                Back to Home
            </button>

        </div>

    );
}

export default AdminLogin;