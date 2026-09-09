import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css";
import API_URL from "../../api/api";

const Product = ({ product }) => {
    const navigate = useNavigate();

    const [cartMessage, setCartMessage] = useState("");
    const [wishlistMessage, setWishlistMessage] = useState("");

    const [cartLoading, setCartLoading] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    if (!product) {
        return null;
    }

    const productImage = product.images?.[0]?.url;
    const productPrice =
        product.discountPrice && Number(product.discountPrice) > 0
            ? product.discountPrice
            : product.price;

    // ==============================
    // ADD TO CART
    // ==============================

    const handleAddToCart = async () => {
        const token = localStorage.getItem("token");

        // ==============================
        // USER NOT LOGGED IN
        // ==============================

        if (!token) {
            setCartMessage("Please login first");

            // Remember that user wanted to add this product
            localStorage.setItem("cartAfterLogin", "true");
            localStorage.setItem(
                "pendingCartProduct",
                JSON.stringify({
                    productId: product._id,
                    quantity: 1
                })
            );

            // Open Login Page
            setTimeout(() => {
                navigate("/login");
            }, 500);

            return;
        }

        // ==============================
        // USER IS LOGGED IN
        // ==============================

        try {
            setCartLoading(true);
            setCartMessage("");

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
                setCartMessage(
                    data.message || "Failed to add product"
                );
                return;
            }

            setCartMessage("Added to cart ✓");

        } catch (error) {
            console.error("Add to cart error:", error);
            setCartMessage(
                "Unable to connect to server"
            );

        } finally {
            setCartLoading(false);
        }
    };

    // ==============================
    // ADD TO WISHLIST
    // ==============================

    const handleAddToWishlist = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setWishlistMessage("Please login first");

            // Open Login Page
            setTimeout(() => {
                navigate("/login");
            }, 500);

            return;
        }

        try {
            setWishlistLoading(true);
            setWishlistMessage("");

            const response = await fetch(`${API_URL}/wishlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: product._id
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setWishlistMessage(
                    data.message ||
                    "Failed to add to wishlist"
                );
                return;
            }

            setWishlistMessage(
                "Added to wishlist ✓"
            );

        } catch (error) {
            console.error("Wishlist error:", error);

            setWishlistMessage(
                "Unable to connect to server"
            );

        } finally {
            setWishlistLoading(false);
        }
    };

    // ==============================
    // UI
    // ==============================

    return (
        <div className="card">

            {/* ==============================
                PRODUCT IMAGE
            ============================== */}

            <div className="product-image-container">

                <img
                    src={productImage}
                    alt={product.name}
                    className="product-image"
                />

                {/* Wishlist Heart */}

                <button
                    className="wishlist-heart"
                    onClick={handleAddToWishlist}
                    disabled={wishlistLoading}
                    title="Add to Wishlist"
                >
                    ♡
                </button>

            </div>

            {/* ==============================
                PRODUCT DETAILS
            ============================== */}

            <div className="product-details">

                <h3>
                    {product.name}
                </h3>

                <p className="product-price">
                    ₹{Number(productPrice).toLocaleString("en-IN")}
                </p>

                {/* ==============================
                    ADD TO CART
                ============================== */}

                <button
                    className="cart-btn"
                    onClick={handleAddToCart}
                    disabled={cartLoading}
                >

                    <span className="cart-icon">
                        🛒
                    </span>

                    <span>
                        {cartLoading
                            ? "Adding..."
                            : "Add To Cart"}
                    </span>

                </button>

                {/* ==============================
                    WISHLIST MESSAGE
                ============================== */}

                {wishlistMessage && (
                    <p className="wishlist-message">
                        {wishlistMessage}
                    </p>
                )}

                {/* ==============================
                    CART MESSAGE
                ============================== */}

                {cartMessage && (
                    <p className="cart-message">
                        {cartMessage}
                    </p>
                )}

            </div>

        </div>
    );
};

export default Product;