import React, { useEffect, useState } from "react";
import API_URL from "../api/api";
import "./BestSeller.css";

function BestSeller() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchBestSellers = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/products`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to load products"
                    );
                }

                const allProducts =
                    data.products || [];

                const bestSellerProducts =
                    allProducts.filter(
                        (product) =>
                            product.bestSeller === true
                    );

                setProducts(
                    bestSellerProducts
                );

            } catch (error) {

                console.error(
                    "Best Seller Error:",
                    error
                );

                setError(
                    "Unable to load Best Sellers."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchBestSellers();

    }, []);


    return (

        <div className="best-seller-page">


            {/* =========================
                HEADER
            ========================= */}

            <section className="best-seller-header">

                <p>
                    ✦ SAAJKAR COLLECTION ✦
                </p>

                <h1>
                    BEST SELLERS
                </h1>

                <div className="best-seller-line"></div>

                <span>
                    Discover the jewellery
                    loved by our customers.
                </span>

            </section>


            {/* =========================
                PRODUCTS
            ========================= */}

            <section className="best-seller-products">

                <div className="best-seller-heading">

                    <p>
                        OUR FAVOURITES
                    </p>

                    <h2>
                        Best Selling Jewellery
                    </h2>

                </div>


                {/* LOADING */}

                {loading && (

                    <div className="best-seller-message">

                        Loading Best Sellers...

                    </div>

                )}


                {/* ERROR */}

                {!loading && error && (

                    <div className="best-seller-message error">

                        {error}

                    </div>

                )}


                {/* NO PRODUCTS */}

                {!loading &&
                    !error &&
                    products.length === 0 && (

                        <div className="best-seller-message">

                            <h3>
                                No Best Sellers Yet
                            </h3>

                            <p>
                                Products marked as
                                "Add to Best Sellers"
                                will appear here.
                            </p>

                        </div>

                    )}


                {/* PRODUCTS */}

                {!loading &&
                    !error &&
                    products.length > 0 && (

                        <div className="best-seller-grid">

                            {products.map(
                                (product) => (

                                    <div
                                        className="best-seller-card"
                                        key={product._id}
                                    >


                                        {/* IMAGE */}

                                        <div className="best-seller-image">

                                            {product.images &&
                                                product.images.length >
                                                0 ? (

                                                <img
                                                    src={
                                                        product.images[0].url
                                                    }
                                                    alt={
                                                        product.name
                                                    }
                                                />

                                            ) : (

                                                <div className="no-image">
                                                    No Image
                                                </div>

                                            )}


                                            {/* WISHLIST */}

                                            <button
                                                className="wishlist-btn"
                                                type="button"
                                            >
                                                ♡
                                            </button>


                                            {/* BADGE */}

                                            <span className="best-seller-badge">

                                                BEST SELLER

                                            </span>

                                        </div>


                                        {/* DETAILS */}

                                        <div className="best-seller-details">

                                            <h3>
                                                {product.name}
                                            </h3>

                                            <p>
                                                {product.material ||
                                                    "Handcrafted"}
                                            </p>


                                            {/* PRICE */}

                                            <div className="best-seller-price">

                                                {product.discountPrice &&
                                                    Number(
                                                        product.discountPrice
                                                    ) > 0 ? (

                                                    <>

                                                        <span className="old-price">

                                                            ₹
                                                            {product.price}

                                                        </span>

                                                        <strong>

                                                            ₹
                                                            {
                                                                product.discountPrice
                                                            }

                                                        </strong>

                                                    </>

                                                ) : (

                                                    <strong>

                                                        ₹
                                                        {product.price}

                                                    </strong>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

            </section>


            {/* =========================
                BOTTOM SECTION
            ========================= */}

            <section className="best-seller-bottom">

                <p>
                    ✦ SAAJKAR ✦
                </p>

                <h2>

                    LOVED BY MANY.
                    <br />
                    MADE FOR YOU.

                </h2>

                <span>

                    Discover timeless jewellery
                    crafted for every special moment.

                </span>

            </section>


        </div>

    );
}

export default BestSeller;