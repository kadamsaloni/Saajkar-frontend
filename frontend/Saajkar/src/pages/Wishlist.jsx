import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Wishlist.css";
import API_URL from "../api/api";

function Wishlist() {

    const navigate = useNavigate();

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch wishlist from backend
    useEffect(() => {

        const fetchWishlist = async () => {

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login first");
                setLoading(false);
                return;
            }

            try {

                const response = await fetch(`${API_URL}/wishlist`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "Failed to load wishlist");
                    return;
                }

                setWishlist(data.wishlist?.products || []);

            } catch (error) {

                console.error("Wishlist fetch error:", error);
                setError("Unable to connect to server");

            } finally {

                setLoading(false);

            }
        };

        fetchWishlist();

    }, []);


    // Remove item from wishlist
    const removeWishlist = async (productId) => {

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login first");
            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/wishlist/${productId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to remove product");
                return;
            }

            // Update page immediately
            setWishlist(prevWishlist =>
                prevWishlist.filter(
                    product => product._id !== productId
                )
            );

        } catch (error) {

            console.error("Remove wishlist error:", error);
            alert("Unable to connect to server");

        }
    };


    // Add wishlist item to cart
    const addToCart = async (product) => {

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first");
            navigate("/login");
            return;
        }

        try {

            const response = await fetch(`${API_URL}/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: product._id,
                    quantity: 1
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to add product to cart");
                return;
            }

            alert(`${product.name} added to cart!`);

            navigate("/cart");

        } catch (error) {

            console.error("Add to cart error:", error);
            alert("Unable to connect to server");

        }
    };


    // Loading
    if (loading) {

        return (
            <div className="wishlist-page">

                <h1>My Wishlist</h1>

                <h2>
                    Loading wishlist...
                </h2>

            </div>
        );

    }


    // Error
    if (error) {

        return (
            <div className="wishlist-page">

                <h1>My Wishlist</h1>

                <h2>
                    {error}
                </h2>

            </div>
        );

    }


    return (

        <div className="wishlist-page">

            <h1>
                My Wishlist
            </h1>


            {wishlist.length === 0 ? (

                <h2 className="empty-wishlist">
                    Your wishlist is empty
                </h2>

            ) : (

                <div className="wishlist-grid">

                    {wishlist.map(product => (

                        <div
                            className="wishlist-card"
                            key={product._id}
                        >

                            <img
                                src={product.images?.[0]?.url}
                                alt={product.name}
                            />


                            <h3>
                                {product.name}
                            </h3>


                            <p>
                                ₹{product.discountPrice || product.price}
                            </p>


                            <button
                                className="cart-btn"
                                onClick={() =>
                                    addToCart(product)
                                }
                            >
                                Add To Cart
                            </button>


                            <button
                                className="remove-btn"
                                onClick={() =>
                                    removeWishlist(product._id)
                                }
                            >
                                Remove
                            </button>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );
}

export default Wishlist;