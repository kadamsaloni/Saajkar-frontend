
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Shop.css";
import API_URL from "../api/api";

const Shop = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [addingCart, setAddingCart] = useState(null);
    const [addingWishlist, setAddingWishlist] = useState(null);

    // =========================
    // FETCH ALL PRODUCTS
    // =========================

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${API_URL}/products`);

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load products"
                    );
                }

                const allProducts = data.products || [];

                // Mix products from all categories
                const shuffledProducts = [...allProducts].sort(
                    () => Math.random() - 0.5
                );

                setProducts(shuffledProducts);

            } catch (error) {
                console.error("Shop Product Error:", error);
                setError("Unable to load products.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);


    // =========================
    // ADD TO CART
    // =========================

    const addToCart = async (product) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first.");
            navigate("/login");
            return;
        }

        try {
            setAddingCart(product._id);

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
                throw new Error(
                    data.message || "Failed to add product to cart"
                );
            }

            alert(`${product.name} added to cart!`);

            // Go to cart after adding
            navigate("/cart");

        } catch (error) {
            console.error("Add to cart error:", error);

            alert(
                error.message ||
                "Unable to add product to cart."
            );

        } finally {
            setAddingCart(null);
        }
    };


    // =========================
    // ADD TO WISHLIST
    // =========================

    const addToWishlist = async (product) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first.");
            navigate("/login");
            return;
        }

        try {
            setAddingWishlist(product._id);

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
                throw new Error(
                    data.message ||
                    "Failed to add product to wishlist"
                );
            }

            alert(`${product.name} added to wishlist!`);

        } catch (error) {
            console.error("Add wishlist error:", error);

            alert(
                error.message ||
                "Unable to add product to wishlist."
            );

        } finally {
            setAddingWishlist(null);
        }
    };


    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="shop-loading">
                Loading products...
            </div>
        );
    }


    // =========================
    // ERROR
    // =========================

    if (error) {
        return (
            <div className="shop-error">
                {error}
            </div>
        );
    }


    return (
        <div className="shop-page">

            {/* =========================
                SHOP HEADER
            ========================= */}

            <section className="shop-header">

                <p className="shop-small-title">
                    SAAJKAR COLLECTION
                </p>

                <h1>
                   
                </h1>

                <p className="shop-description">
                    Discover our complete collection of
                    handcrafted traditional jewellery.
                </p>

            </section>


            {/* =========================
                ALL PRODUCTS
            ========================= */}

            <section className="shop-content">

                {products.length === 0 ? (

                    <div className="shop-empty">

                        <h2>
                            No Products Available
                        </h2>

                        <p>
                            Products added by the admin
                            will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="shop-grid">

                        {products.map((product) => {

                            const image =
                                product.images?.[0]?.url ||
                                product.image ||
                                "";

                            const sellingPrice =
                                product.discountPrice &&
                                Number(product.discountPrice) > 0
                                    ? product.discountPrice
                                    : product.price;

                            const categoryName =
                                product.category?.name ||
                                product.category ||
                                "Jewellery";

                            return (

                                <div
                                    className="shop-card"
                                    key={product._id}
                                >

                                    {/* =========================
                                        PRODUCT IMAGE
                                    ========================= */}

                                    <div className="shop-image">

                                        {image ? (

                                            <img
                                                src={image}
                                                alt={product.name}
                                            />

                                        ) : (

                                            <div className="no-product-image">
                                                No Image
                                            </div>

                                        )}


                                        {/* WISHLIST */}

                                        <button
                                            type="button"
                                            className="wishlist-button"
                                            onClick={() =>
                                                addToWishlist(product)
                                            }
                                            disabled={
                                                addingWishlist ===
                                                product._id
                                            }
                                            title="Add to Wishlist"
                                        >
                                            {addingWishlist ===
                                            product._id
                                                ? "♥"
                                                : "♡"}
                                        </button>

                                    </div>


                                    {/* =========================
                                        PRODUCT DETAILS
                                    ========================= */}

                                    <div className="shop-info">

                                        <p className="product-category">
                                            {categoryName}
                                        </p>

                                        <h3>
                                            {product.name}
                                        </h3>

                                        <div className="price-section">

                                            <span className="shop-price">
                                                ₹{sellingPrice}
                                            </span>

                                            {product.discountPrice > 0 &&
                                                Number(
                                                    product.discountPrice
                                                ) <
                                                    Number(
                                                        product.price
                                                    ) && (

                                                    <span className="original-price">
                                                        ₹{product.price}
                                                    </span>

                                                )}

                                        </div>


                                        {/* ADD TO CART */}

                                        <button
                                            type="button"
                                            className="add-cart-button"
                                            onClick={() =>
                                                addToCart(product)
                                            }
                                            disabled={
                                                addingCart ===
                                                product._id
                                            }
                                        >

                                            {addingCart ===
                                            product._id
                                                ? "ADDING..."
                                                : "ADD TO CART"}

                                        </button>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}

            </section>

        </div>
    );
};

export default Shop;

