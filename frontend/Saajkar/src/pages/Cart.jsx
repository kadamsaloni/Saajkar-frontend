import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import API_URL from "../api/api";

const Cart = () => {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Load cart from backend
    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login first");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/cart`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "Failed to load cart");
                    return;
                }

                setCartItems(data.cart?.items || []);

            } catch (error) {
                console.error("Cart fetch error:", error);
                setError("Unable to connect to server");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    // Remove item from cart
    const removeItem = async (productId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/cart/${productId}`,
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

            setCartItems(data.cart?.items || []);

        } catch (error) {
            console.error("Remove cart item error:", error);
            alert("Unable to connect to server");
        }
    };

    // Update quantity
    const updateQuantity = async (productId, quantity) => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        if (quantity < 1) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/cart`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId,
                    quantity
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to update quantity");
                return;
            }

            setCartItems(data.cart?.items || []);

        } catch (error) {
            console.error("Update cart error:", error);
            alert("Unable to connect to server");
        }
    };

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
        const price =
            item.product?.discountPrice ||
            item.product?.price ||
            0;

        return sum + Number(price) * Number(item.quantity);
    }, 0);

    // Loading
    if (loading) {
        return (
            <div className="cart-page">
                <h1>Your Cart</h1>
                <h2>Loading cart...</h2>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="cart-page">
                <h1>Your Cart</h1>
                <h2>{error}</h2>
            </div>
        );
    }

    return (
        <div className="cart-page">

            <h1>
                Your Cart
            </h1>

            {cartItems.length === 0 ? (

                <div className="empty">

                    <h2>
                        Your cart is empty
                    </h2>

                    <button
                        onClick={() => navigate("/")}
                    >
                        Continue Shopping
                    </button>

                </div>

            ) : (

                <>

                    <div className="cart-container">

                        {cartItems.map(item => {

                            const product = item.product;

                            if (!product) {
                                return null;
                            }

                            const price =
                                product.discountPrice ||
                                product.price;

                            return (
                                <div
                                    className="cart-card"
                                    key={item._id}
                                >

                                    <img
                                        src={product.images?.[0]?.url}
                                        alt={product.name}
                                    />

                                    <div>

                                        <h2>
                                            {product.name}
                                        </h2>

                                        <p>
                                            Price: ₹{price}
                                        </p>

                                        <p>
                                            Quantity: {item.quantity}
                                        </p>

                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    product._id,
                                                    item.quantity - 1
                                                )
                                            }
                                            disabled={item.quantity <= 1}
                                        >
                                            −
                                        </button>

                                        <span>
                                            {" "}{item.quantity}{" "}
                                        </span>

                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    product._id,
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                        <br />

                                        <button
                                            onClick={() =>
                                                removeItem(product._id)
                                            }
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                    <div className="cart-total">

                        <h2>
                            Total: ₹{total}
                        </h2>

                        <button
                            type="button"
                            className="checkout-btn"
                            onClick={() =>
                                navigate("/checkout")
                            }
                        >
                            Proceed to Checkout
                        </button>

                    </div>

                </>
            )}

        </div>
    );
};

export default Cart;