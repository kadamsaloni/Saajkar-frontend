import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../api/api";
import Product from "../components/Product/Product.jsx";

function Collection() {
    const { category } = useParams();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                // Get all categories
                const categoryResponse = await fetch(
                    `${API_URL}/categories`
                );

                const categoryData = await categoryResponse.json();

                if (!categoryResponse.ok) {
                    throw new Error(
                        categoryData.message ||
                        "Failed to fetch categories"
                    );
                }

                // Find category by name
                const selectedCategory = categoryData.categories.find(
                    (item) =>
                        item.name.toLowerCase() ===
                        category.toLowerCase()
                );

                if (!selectedCategory) {
                    setProducts([]);
                    return;
                }

                // Fetch products using category ID
                const response = await fetch(
                    `${API_URL}/products?category=${selectedCategory._id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to fetch products"
                    );
                }

                setProducts(data.products || []);

            } catch (error) {
                console.error("Product Fetch Error:", error);
                setError("Unable to load products.");
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchProducts();
        }
    }, [category]);

    if (loading) {
        return (
            <div>
                <h2>Loading products...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h2>{error}</h2>
            </div>
        );
    }

    return (
        <div>
            <h2>
                Category: {category}
            </h2>

            <h3>
                Products: {products.length}
            </h3>

            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div>
                    {products.map((product) => (
                        <Product
                            key={product._id}
                            product={product}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Collection;