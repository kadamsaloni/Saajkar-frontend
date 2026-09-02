import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../api/api";
import Product from "../components/Product/Product.jsx";
import "./Collection.css";

const Collection = () => {
    const { category } = useParams();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");
                setProducts([]);

                // Fetch all categories
                const categoryResponse = await fetch(
                    `${API_URL}/categories`
                );

                const categoryData = await categoryResponse.json();

                if (!categoryResponse.ok) {
                    throw new Error(
                        categoryData.message || "Failed to fetch categories"
                    );
                }

                // Convert URL category
                // Example: bridal-sets → bridal sets
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

                // Category not found
                if (!selectedCategory) {
                    setProducts([]);
                    return;
                }

                // Fetch products for selected category
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

    // Format category name for display
    const displayCategory = category
        ? category.replace(/-/g, " ")
        : "Collection";

    return (
        <div className="collection-page">

            {/* Collection Heading */}
            <div className="collection-header">

                <h1>{displayCategory}</h1>

                <div className="title-line"></div>

                <p>
                    Timeless beauty, crafted to perfection.
                </p>

            </div>

            {/* Products */}
            {products.length === 0 ? (
                <div className="collection-message">
                    <h2>No Products Found</h2>

                    <p>
                        There are currently no products available
                        in this collection.
                    </p>
                </div>
            ) : (
                <div className="products-container">

                    {products.map((product) => (
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