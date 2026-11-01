
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import API_URL from "../api/api";
import Product from "../components/Product/Product.jsx";
import "./Collection.css";

const Collection = () => {
    const { category } = useParams();
    const [searchParams] = useSearchParams();

    const priceFilter = searchParams.get("price");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortOption, setSortOption] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");
                setProducts([]);

                // Fetch categories
                const categoryResponse = await fetch(
                    `${API_URL}/categories`
                );

                const categoryData = await categoryResponse.json();

                if (!categoryResponse.ok) {
                    throw new Error(
                        categoryData.message || "Failed to fetch categories"
                    );
                }

                // Format category name
                const formattedCategory = category
                    .replace(/-/g, " ")
                    .trim()
                    .toLowerCase();

                // Find selected category
                const selectedCategory =
                    categoryData.categories?.find(
                        (item) =>
                            item.name.trim().toLowerCase() ===
                            formattedCategory
                    );

                if (!selectedCategory) {
                    setProducts([]);
                    return;
                }

                // Fetch category products
                const productResponse = await fetch(
                    `${API_URL}/products?category=${selectedCategory._id}`
                );

                const productData = await productResponse.json();

                if (!productResponse.ok) {
                    throw new Error(
                        productData.message || "Failed to fetch products"
                    );
                }

                setProducts(productData.products || []);

            } catch (err) {
                console.error("Collection Error:", err);
                setError("Unable to load products.");
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchProducts();
        }
    }, [category]);

    // Filter products by price
    const filteredProducts = products.filter((product) => {
        const price = Number(
            product.discountPrice || product.price || 0
        );

        if (priceFilter === "under1000") {
            return price < 1000;
        }

        if (priceFilter === "1000-5000") {
            return price >= 1000 && price <= 5000;
        }

        if (priceFilter === "above5000") {
            return price > 5000;
        }

        return true;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const priceA = Number(a.discountPrice || a.price || 0);
        const priceB = Number(b.discountPrice || b.price || 0);

        if (sortOption === "lowToHigh") {
            return priceA - priceB;
        }

        if (sortOption === "highToLow") {
            return priceB - priceA;
        }

        return 0;
    });

    const displayCategory = category
        ? category.replace(/-/g, " ")
        : "Collection";

    // Loading
    if (loading) {
        return (
            <div className="collection-page">
                <div className="collection-message">
                    <h2>Loading Collection...</h2>
                </div>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="collection-page">
                <div className="collection-message">
                    <h2>{error}</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="collection-page">

            {/* COLLECTION HEADER */}
            <div className="collection-header">

                <h1>{displayCategory}</h1>

                <div className="heading-line">
                    <span></span>
                    <i>✦</i>
                    <span></span>
                </div>

                <p>
                    Timeless beauty, crafted to perfection.
                </p>

            </div>

            {/* SORT TOOLBAR */}
            {sortedProducts.length > 0 && (
                <div className="collection-toolbar">

                    <p>
                        {sortedProducts.length} Products
                    </p>

                    <div className="sort-box">

                        <label htmlFor="sort">
                            Sort By:
                        </label>

                        <select
                            id="sort"
                            value={sortOption}
                            onChange={(e) =>
                                setSortOption(e.target.value)
                            }
                        >
                            <option value="">Default</option>

                            <option value="lowToHigh">
                                Price: Low to High
                            </option>

                            <option value="highToLow">
                                Price: High to Low
                            </option>
                        </select>

                    </div>

                </div>
            )}

            {/* PRODUCTS */}
            {sortedProducts.length === 0 ? (

                <div className="collection-message">
                    <h2>No Products Found</h2>

                    <p>
                        There are currently no products available
                        in this collection.
                    </p>
                </div>

            ) : (

                <div className="products-container">

                    {sortedProducts.map((product) => (
                        <div
                            className="collection-product"
                            key={product._id}
                        >
                            <Product product={product} />
                        </div>
                    ))}

                </div>

            )}

        </div>
    );
};

export default Collection;
