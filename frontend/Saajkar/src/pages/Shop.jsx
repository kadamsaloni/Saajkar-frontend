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

    // SORT
    const [sortBy, setSortBy] = useState("default");


    // =========================
    // FETCH ALL PRODUCTS
    // =========================

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/products?limit=100`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load products"
                    );
                }

                const allProducts = data.products || [];

                setProducts(allProducts);

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
    // SORT PRODUCTS
    // =========================

    const sortedProducts = [...products].sort((a, b) => {

        const priceA =
            Number(
                a.discountPrice &&
                Number(a.discountPrice) > 0
                    ? a.discountPrice
                    : a.price
            ) || 0;

        const priceB =
            Number(
                b.discountPrice &&
                Number(b.discountPrice) > 0
                    ? b.discountPrice
                    : b.price
            ) || 0;


        if (sortBy === "price-low") {
            return priceA - priceB;
        }


        if (sortBy === "price-high") {
            return priceB - priceA;
        }


        if (sortBy === "name-az") {
            return (a.name || "").localeCompare(
                b.name || ""
            );
        }


        if (sortBy === "name-za") {
            return (b.name || "").localeCompare(
                a.name || ""
            );
        }


        if (sortBy === "newest") {
            return (
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
            );
        }


        return 0;
    });


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

            const response = await fetch(
                `${API_URL}/cart`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        productId: product._id,
                        quantity: 1
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to add product to cart"
                );
            }

            alert(
                `${product.name} added to cart!`
            );

            navigate("/cart");

        } catch (error) {
            console.error(
                "Add to cart error:",
                error
            );

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

            const response = await fetch(
                `${API_URL}/wishlist`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        productId: product._id
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to add product to wishlist"
                );
            }

            alert(
                `${product.name} added to wishlist!`
            );

        } catch (error) {
            console.error(
                "Add wishlist error:",
                error
            );

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

                <h1></h1>

                <p className="shop-description">
                    Discover our complete collection of
                    handcrafted traditional jewellery.
                </p>

            </section>


            {/* =========================
                SHOP CONTENT
            ========================= */}

            <section className="shop-content">


                {/* =========================
                    PRODUCT COUNT + SORT
                ========================= */}

                <div className="shop-toolbar">

                    <p className="product-count">
                        {products.length} Products
                    </p>


                    <div className="sort-section">

                        <label htmlFor="sortProducts">
                            Sort By:
                        </label>

                        <select
                            id="sortProducts"
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(e.target.value)
                            }
                        >

                            <option value="default">
                                Default
                            </option>

                            <option value="price-low">
                                Price: Low to High
                            </option>

                            <option value="price-high">
                                Price: High to Low
                            </option>

                            <option value="name-az">
                                Name: A to Z
                            </option>

                            <option value="name-za">
                                Name: Z to A
                            </option>

                            <option value="newest">
                                Newest Arrivals
                            </option>

                        </select>

                    </div>

                </div>


                {/* =========================
                    PRODUCTS
                ========================= */}

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

                        {sortedProducts.map(
                            (product) => {

                                const image =
                                    product.images?.[0]?.url ||
                                    product.image ||
                                    "";

                                const sellingPrice =
                                    product.discountPrice &&
                                    Number(
                                        product.discountPrice
                                    ) > 0
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
                                                    addToWishlist(
                                                        product
                                                    )
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
                                            PRODUCT INFO
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


                                                {product.discountPrice &&
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
                                                    addToCart(
                                                        product
                                                    )
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

                            }
                        )}

                    </div>

                )}

            </section>

        </div>
    );
};

export default Shop;