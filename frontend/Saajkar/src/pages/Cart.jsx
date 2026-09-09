import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import API_URL from "../api/api";

const Cart = () => {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* =========================
       FETCH CART
    ========================= */

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


    /* =========================
       REMOVE ITEM
    ========================= */

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


    /* =========================
       UPDATE QUANTITY
    ========================= */

    const updateQuantity = async (productId, quantity) => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        /* 
           If quantity becomes 0,
           remove the product completely.
        */

        if (quantity <= 0) {
            await removeItem(productId);
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
                alert(
                    data.message ||
                    "Failed to update quantity"
                );
                return;
            }

            setCartItems(data.cart?.items || []);

        } catch (error) {
            console.error("Update cart error:", error);
            alert("Unable to connect to server");
        }
    };


    /* =========================
       TOTAL
    ========================= */

    const total = cartItems.reduce((sum, item) => {
        const price =
            item.product?.discountPrice ||
            item.product?.price ||
            0;

        return (
            sum +
            Number(price) *
            Number(item.quantity)
        );
    }, 0);


    /* =========================
       LOADING
    ========================= */

    if (loading) {
        return (
            <div className="cart-page">
                <h1>Your Cart</h1>
                <h2>Loading cart...</h2>
            </div>
        );
    }


    /* =========================
       LOGIN REQUIRED
    ========================= */

    if (error) {
        return (
            <div className="cart-page">

                <h1>Your Cart</h1>

                <div className="login-required">

                    <h2>{error}</h2>

                    <button
                        className="login-first-btn"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login First
                    </button>

                </div>

            </div>
        );
    }


    /* =========================
       CART PAGE
    ========================= */

    return (
        <div className="cart-page">

            <h1>Your Cart</h1>


            {/* EMPTY CART */}

            {cartItems.length === 0 ? (

                <div className="empty">

                    <h2>
                        Your cart is empty
                    </h2>

                    <button
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Continue Shopping
                    </button>

                </div>

            ) : (

                <>

                    {/* CART PRODUCTS */}

                    <div className="cart-container">

                        {cartItems.map((item) => {

                            const product =
                                item.product;

                            if (!product) {
                                return null;
                            }

                            const price =
                                product.discountPrice ||
                                product.price ||
                                0;


                            return (

                                <div
                                    className="cart-card"
                                    key={item._id}
                                >

                                    {/* PRODUCT IMAGE */}

                                    <img
                                        src={
                                            product.images?.[0]?.url
                                        }
                                        alt={
                                            product.name
                                        }
                                    />


                                    {/* PRODUCT DETAILS */}

                                    <div className="cart-product-details">

                                        <h2>
                                            {product.name}
                                        </h2>


                                        <p>
                                            Price: ₹{price}
                                        </p>


                                        {/* QUANTITY */}

                                        <div className="quantity-section">

                                            <span className="quantity-label">
                                                Quantity:
                                            </span>


                                            {/* MINUS */}

                                            <button
                                                className="quantity-minus"
                                                onClick={() =>
                                                    updateQuantity(
                                                        product._id,
                                                        Number(
                                                            item.quantity
                                                        ) - 1
                                                    )
                                                }
                                            >
                                                −
                                            </button>


                                            {/* QUANTITY NUMBER */}

                                            <span className="quantity-number">
                                                {item.quantity}
                                            </span>


                                            {/* PLUS */}

                                            <button
                                                className="quantity-plus"
                                                onClick={() =>
                                                    updateQuantity(
                                                        product._id,
                                                        Number(
                                                            item.quantity
                                                        ) + 1
                                                    )
                                                }
                                            >
                                                +
                                            </button>

                                        </div>


                                        {/* REMOVE BUTTON */}

                                        <button
                                            className="remove-btn"
                                            onClick={() =>
                                                removeItem(
                                                    product._id
                                                )
                                            }
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            );

                        })}

                    </div>


                    {/* TOTAL */}

                    <div className="cart-total">

                        <h2>
                            Total: ₹{total}
                        </h2>


                        <button
                            type="button"
                            className="checkout-btn"
                            onClick={() => {

                                const token =
                                    localStorage.getItem(
                                        "token"
                                    );

                                if (!token) {

                                    localStorage.setItem(
                                        "checkoutAfterLogin",
                                        "true"
                                    );

                                    navigate(
                                        "/register"
                                    );

                                } else {

                                    navigate(
                                        "/checkout"
                                    );

                                }

                            }}
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