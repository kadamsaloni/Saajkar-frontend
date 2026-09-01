import React, { useState } from "react";
import "./Product.css";
import API_URL from "../../api/api";

const Product = ({ product }) => {
    const [cartMessage, setCartMessage] = useState("");
    const [wishlistMessage, setWishlistMessage] = useState("");

    const [cartLoading, setCartLoading] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    if (!product) {
        return null;
    }

    const productImage = product.images?.[0]?.url;
    const productPrice = product.discountPrice || product.price;

    // ADD TO CART
    const handleAddToCart = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setCartMessage("Please login first");
            return;
        }

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
                setCartMessage(data.message || "Failed to add product");
                return;
            }

            setCartMessage("Added to cart ✓");

        } catch (error) {
            console.error("Add to cart error:", error);
            setCartMessage("Unable to connect to server");

        } finally {
            setCartLoading(false);
        }
    };

    // ADD TO WISHLIST
    const handleAddToWishlist = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setWishlistMessage("Please login first");
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
                    data.message || "Failed to add to wishlist"
                );
                return;
            }

            setWishlistMessage("Added to wishlist ✓");

        } catch (error) {
            console.error("Wishlist error:", error);
            setWishlistMessage("Unable to connect to server");

        } finally {
            setWishlistLoading(false);
        }
    };

    return (
        <div className="card">

            <img
                src={productImage}
                alt={product.name}
            />

            <h3>
                {product.name}
            </h3>

            <p>
                ₹{productPrice}
            </p>

            <button
                onClick={handleAddToWishlist}
                disabled={wishlistLoading}
            >
                {wishlistLoading ? "Adding..." : "♡ Wishlist"}
            </button>

            {wishlistMessage && (
                <p>
                    {wishlistMessage}
                </p>
            )}

            <button
                onClick={handleAddToCart}
                disabled={cartLoading}
            >
                {cartLoading ? "Adding..." : "Add To Cart"}
            </button>

            {cartMessage && (
                <p>
                    {cartMessage}
                </p>
            )}

        </div>
    );
};

export default Product;