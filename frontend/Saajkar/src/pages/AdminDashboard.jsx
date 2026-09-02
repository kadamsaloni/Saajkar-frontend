import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api/api";

function AdminDashboard() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [deletingAll, setDeletingAll] = useState(false);

    // =========================
    // FETCH CATEGORIES
    // =========================
    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/categories`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            console.log("Categories from backend:", data);

            if (!response.ok) {
                setError(
                    data.message || "Failed to load categories"
                );
                return;
            }

            setCategories(data.categories || []);

        } catch (error) {
            console.error(error);
            setError("Unable to load categories");
        }
    };

    // =========================
    // FETCH PRODUCTS
    // =========================
    const fetchProducts = async (categoryId = "all") => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            let url = `${API_URL}/products`;

            if (categoryId !== "all") {
                url += `?category=${categoryId}`;
            }

            const response = await fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            console.log("Products:", data);

            if (!response.ok) {
                setError(
                    data.message || "Failed to load products"
                );
                return;
            }

            setProducts(data.products || []);

        } catch (error) {
            console.error(error);
            setError("Unable to connect to server");

        } finally {
            setLoading(false);
        }
    };

    // =========================
    // DELETE ONE PRODUCT
    // =========================
    const handleDelete = async (productId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(productId);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/products/${productId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Failed to delete product"
                );
                return;
            }

            alert("Product deleted successfully");

            // Refresh current category
            fetchProducts(selectedCategory);

        } catch (error) {
            console.error(error);
            alert("Unable to connect to server");

        } finally {
            setDeletingId(null);
        }
    };

    // =========================
    // DELETE ALL PRODUCTS
    // =========================
    const handleDeleteAll = async () => {

        const confirmed = window.confirm(
            "WARNING!\n\nThis will permanently delete ALL products.\n\nAre you sure you want to continue?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingAll(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/products/delete-all`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Failed to delete all products"
                );
                return;
            }

            alert(
                `All products deleted successfully.\nDeleted: ${data.deletedCount}`
            );

            setProducts([]);

        } catch (error) {
            console.error(error);
            alert("Unable to connect to server");

        } finally {
            setDeletingAll(false);
        }
    };

    // =========================
    // CATEGORY CHANGE
    // =========================
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        fetchProducts(categoryId);
    };

    // =========================
    // INITIAL LOAD
    // =========================
    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    // =========================
    // PAGE
    // =========================
    return (
        <div style={{ padding: "30px" }}>

            <h1>
                Admin Dashboard
            </h1>

            {/* ACTION BUTTONS */}
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "25px"
                }}
            >

                <button
                    onClick={() =>
                        navigate("/admin/add-product")
                    }
                    style={{
                        padding: "10px 20px",
                        cursor: "pointer"
                    }}
                >
                    + Add Product
                </button>

                <button
                    onClick={handleDeleteAll}
                    disabled={deletingAll}
                    style={{
                        padding: "10px 20px",
                        cursor: deletingAll
                            ? "not-allowed"
                            : "pointer"
                    }}
                >
                    {deletingAll
                        ? "Deleting..."
                        : "Delete All Products"}
                </button>

            </div>

            <h2>
                Inventory
            </h2>

            {/* CATEGORY BUTTONS */}
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginBottom: "25px"
                }}
            >

                {/* ALL PRODUCTS */}
                <button
                    onClick={() =>
                        handleCategoryChange("all")
                    }
                    style={{
                        padding: "10px 18px",
                        cursor: "pointer",
                        fontWeight:
                            selectedCategory === "all"
                                ? "bold"
                                : "normal"
                    }}
                >
                    All Products
                </button>

                {/* CATEGORIES */}
                {categories.map((category) => (

                    <button
                        key={category._id}
                        onClick={() =>
                            handleCategoryChange(
                                category._id
                            )
                        }
                        style={{
                            padding: "10px 18px",
                            cursor: "pointer",
                            fontWeight:
                                selectedCategory ===
                                category._id
                                    ? "bold"
                                    : "normal"
                        }}
                    >
                        {category.name}
                    </button>

                ))}

            </div>

            {/* LOADING */}
            {loading && (
                <p>
                    Loading products...
                </p>
            )}

            {/* ERROR */}
            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {/* NO PRODUCTS */}
            {!loading &&
                !error &&
                products.length === 0 && (
                    <p>
                        No products found in this category.
                    </p>
                )}

            {/* PRODUCTS */}
            <div>

                {products.map((product) => (

                    <div
                        key={product._id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "15px",
                            margin: "10px 0",
                            borderRadius: "8px"
                        }}
                    >

                        {/* PRODUCT IMAGE */}
                        {product.images?.[0]?.url && (
                            <img
                                src={
                                    product.images[0].url
                                }
                                alt={product.name}
                                style={{
                                    width: "120px",
                                    height: "120px",
                                    objectFit: "cover",
                                    borderRadius: "6px"
                                }}
                            />
                        )}

                        <h3>
                            {product.name}
                        </h3>

                        <p>
                            Category:{" "}
                            {product.category?.name ||
                                "Unknown"}
                        </p>

                        <p>
                            Price: ₹
                            {product.discountPrice ||
                                product.price}
                        </p>

                        <p>
                            Stock: {product.stock}
                        </p>

                        <p>
                            Status: {product.status}
                        </p>

                        {/* DELETE */}
                        <button
                            onClick={() =>
                                handleDelete(
                                    product._id
                                )
                            }
                            disabled={
                                deletingId ===
                                product._id
                            }
                            style={{
                                padding: "8px 15px",
                                cursor:
                                    deletingId ===
                                    product._id
                                        ? "not-allowed"
                                        : "pointer"
                            }}
                        >
                            {deletingId ===
                            product._id
                                ? "Deleting..."
                                : "Delete"}
                        </button>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default AdminDashboard;