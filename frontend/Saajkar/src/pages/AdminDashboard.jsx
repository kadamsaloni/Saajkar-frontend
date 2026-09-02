import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api/api";
import "./AdminDashboard.css";

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
            const response = await fetch(`${API_URL}/categories`);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load categories"
                );
            }

            setCategories(data.categories || []);
        } catch (error) {
            console.error("Category Error:", error);
            setError("Unable to load categories.");
        }
    };

    // =========================
    // FETCH PRODUCTS
    // =========================
    const fetchProducts = async (categoryId = "all") => {
        try {
            setLoading(true);
            setError("");

            let url = `${API_URL}/products`;

            if (categoryId !== "all") {
                url += `?category=${categoryId}`;
            }

            const response = await fetch(url);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load products"
                );
            }

            setProducts(data.products || []);
        } catch (error) {
            console.error("Product Error:", error);
            setError("Unable to load products.");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // DELETE SINGLE PRODUCT
    // =========================
    const handleDelete = async (productId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        try {
            setDeletingId(productId);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/products/${productId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete product"
                );
            }

            alert("Product deleted successfully.");

            fetchProducts(selectedCategory);
        } catch (error) {
            console.error("Delete Error:", error);
            alert(error.message || "Unable to delete product.");
        } finally {
            setDeletingId(null);
        }
    };

    // =========================
    // DELETE ALL PRODUCTS
    // =========================
    const handleDeleteAll = async () => {
        if (products.length === 0) {
            alert("There are no products to delete.");
            return;
        }

        const confirmed = window.confirm(
            "WARNING!\n\nThis will permanently delete ALL products.\n\nAre you sure you want to continue?"
        );

        if (!confirmed) return;

        try {
            setDeletingAll(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/products/delete-all`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete all products"
                );
            }

            alert(
                `All products deleted successfully.\nDeleted: ${
                    data.deletedCount || 0
                }`
            );

            setProducts([]);
        } catch (error) {
            console.error("Delete All Error:", error);
            alert(
                error.message ||
                    "Unable to delete all products."
            );
        } finally {
            setDeletingAll(false);
        }
    };

    // =========================
    // CATEGORY FILTER
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
        fetchProducts("all");
    }, []);

    return (
        <div className="admin-dashboard">

            {/* HEADER */}
            <div className="admin-header">

                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Manage your Saajkar products</p>
                </div>

                <div className="admin-actions">

                    <button
                        className="add-product-btn"
                        onClick={() =>
                            navigate("/admin/add-product")
                        }
                    >
                        + Add Product
                    </button>

                    <button
                        className="delete-all-btn"
                        onClick={handleDeleteAll}
                        disabled={deletingAll}
                    >
                        {deletingAll
                            ? "Deleting..."
                            : "Delete All Products"}
                    </button>

                </div>

            </div>

            {/* INVENTORY */}
            <div className="inventory-section">

                <div className="inventory-header">
                    <div>
                        <h2>Inventory</h2>
                        <p>
                            {products.length} product
                            {products.length !== 1
                                ? "s"
                                : ""}
                        </p>
                    </div>
                </div>

                {/* CATEGORY FILTERS */}
                <div className="category-filters">

                    <button
                        className={
                            selectedCategory === "all"
                                ? "category-btn active"
                                : "category-btn"
                        }
                        onClick={() =>
                            handleCategoryChange("all")
                        }
                    >
                        All Products
                    </button>

                    {categories.map((category) => (
                        <button
                            key={category._id}
                            className={
                                selectedCategory ===
                                category._id
                                    ? "category-btn active"
                                    : "category-btn"
                            }
                            onClick={() =>
                                handleCategoryChange(
                                    category._id
                                )
                            }
                        >
                            {category.name}
                        </button>
                    ))}

                </div>

                {/* LOADING */}
                {loading && (
                    <div className="status-message">
                        Loading products...
                    </div>
                )}

                {/* ERROR */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* NO PRODUCTS */}
                {!loading &&
                    !error &&
                    products.length === 0 && (
                        <div className="empty-message">
                            <h3>No products found</h3>
                            <p>
                                There are no products in this
                                category.
                            </p>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/admin/add-product"
                                    )
                                }
                            >
                                + Add Product
                            </button>
                        </div>
                    )}

                {/* PRODUCT GRID */}
                {!loading &&
                    !error &&
                    products.length > 0 && (
                        <div className="product-grid">

                            {products.map((product) => {

                                const image =
                                    product.images?.[0]?.url;

                                const sellingPrice =
                                    product.discountPrice &&
                                    product.discountPrice > 0
                                        ? product.discountPrice
                                        : product.price;

                                return (
                                    <div
                                        className="admin-product-card"
                                        key={product._id}
                                    >

                                        {/* IMAGE */}
                                        <div className="product-image-container">

                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={
                                                        product.name
                                                    }
                                                    className="admin-product-image"
                                                />
                                            ) : (
                                                <div className="no-image">
                                                    No Image
                                                </div>
                                            )}

                                        </div>

                                        {/* DETAILS */}
                                        <div className="product-details">

                                            <h3>
                                                {
                                                    product.name
                                                }
                                            </h3>

                                            <p className="product-category">
                                                Category:{" "}
                                                {
                                                    product
                                                        .category
                                                        ?.name ||
                                                    "Unknown"
                                                }
                                            </p>

                                            <div className="price-row">

                                                <span className="price">
                                                    ₹
                                                    {
                                                        sellingPrice
                                                    }
                                                </span>

                                                {product.discountPrice >
                                                    0 &&
                                                    product.discountPrice <
                                                        product.price && (
                                                        <span className="original-price">
                                                            ₹
                                                            {
                                                                product.price
                                                            }
                                                        </span>
                                                    )}

                                            </div>

                                            <p className="stock">
                                                Stock:{" "}
                                                {
                                                    product.stock
                                                }
                                            </p>

                                            <p
                                                className={
                                                    product.status ===
                                                    "Available"
                                                        ? "status available"
                                                        : "status out-of-stock"
                                                }
                                            >
                                                {
                                                    product.status
                                                }
                                            </p>

                                            {/* DELETE */}
                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(
                                                        product._id
                                                    )
                                                }
                                                disabled={
                                                    deletingId ===
                                                    product._id
                                                }
                                            >
                                                {deletingId ===
                                                product._id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    )}

            </div>

        </div>
    );
}

export default AdminDashboard;