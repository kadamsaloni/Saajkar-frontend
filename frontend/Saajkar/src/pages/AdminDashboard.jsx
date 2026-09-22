import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api/api";
import "./AdminDashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();

    // ==================================================
    // PRODUCT STATES
    // ==================================================

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [deletingId, setDeletingId] = useState(null);
    const [deletingAll, setDeletingAll] = useState(false);

    // ==================================================
    // EDIT PRODUCT STATES
    // ==================================================

    const [editingProduct, setEditingProduct] = useState(null);
    const [savingProduct, setSavingProduct] = useState(false);

    const [editForm, setEditForm] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        discountPrice: "",
        material: "",
        stock: "",
        featured: false,
        bestSeller: false,
        status: "Available",
    });

    // ==================================================
    // CUSTOMIZATION REQUEST STATES
    // ==================================================

    const [customizationRequests, setCustomizationRequests] =
        useState([]);

    const [customizationLoading, setCustomizationLoading] =
        useState(false);

    const [customizationError, setCustomizationError] =
        useState("");

    // ==================================================
    // FETCH CATEGORIES
    // ==================================================

    const fetchCategories = async () => {
        try {
            const response = await fetch(
                `${API_URL}/categories`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to load categories"
                );
            }

            setCategories(data.categories || []);
        } catch (error) {
            console.error(
                "Category Error:",
                error
            );

            setError(
                "Unable to load categories."
            );
        }
    };

    // ==================================================
    // FETCH PRODUCTS
    // ==================================================

    const fetchProducts = async (
        categoryId = "all"
    ) => {
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
                    data.message ||
                        "Failed to load products"
                );
            }

            setProducts(
                data.products || []
            );
        } catch (error) {
            console.error(
                "Product Error:",
                error
            );

            setError(
                "Unable to load products."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==================================================
    // FETCH CUSTOMIZATION REQUESTS
    // ==================================================

    const fetchCustomizationRequests =
        async () => {
            try {
                setCustomizationLoading(true);
                setCustomizationError("");

                const token =
                    localStorage.getItem(
                        "token"
                    );

                const response =
                    await fetch(
                        `${API_URL}/customizations`,
                        {
                            method: "GET",
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                            "Failed to load customization requests"
                    );
                }

                setCustomizationRequests(
                    data.requests || []
                );
            } catch (error) {
                console.error(
                    "Customization Request Error:",
                    error
                );

                setCustomizationError(
                    error.message ||
                        "Unable to load customization requests."
                );
            } finally {
                setCustomizationLoading(
                    false
                );
            }
        };

    // ==================================================
    // UPDATE CUSTOMIZATION STATUS
    // ==================================================

    const updateCustomizationStatus =
        async (
            requestId,
            status
        ) => {
            try {
                const token =
                    localStorage.getItem(
                        "token"
                    );

                const response =
                    await fetch(
                        `${API_URL}/customizations/${requestId}/status`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`,
                            },

                            body: JSON.stringify({
                                status,
                            }),
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                            "Failed to update status"
                    );
                }

                setCustomizationRequests(
                    (prevRequests) =>
                        prevRequests.map(
                            (request) =>
                                request._id ===
                                requestId
                                    ? data.request
                                    : request
                        )
                );

                alert(
                    "Customization request status updated successfully."
                );
            } catch (error) {
                console.error(
                    "Customization Status Error:",
                    error
                );

                alert(
                    error.message ||
                        "Unable to update customization status."
                );
            }
        };

    // ==================================================
    // DELETE SINGLE PRODUCT
    // ==================================================

    const handleDelete = async (
        productId
    ) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this product?"
            );

        if (!confirmed) return;

        try {
            setDeletingId(productId);

            const token =
                localStorage.getItem(
                    "token"
                );

            const response =
                await fetch(
                    `${API_URL}/products/${productId}`,
                    {
                        method: "DELETE",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to delete product"
                );
            }

            alert(
                "Product deleted successfully."
            );

            fetchProducts(
                selectedCategory
            );
        } catch (error) {
            console.error(
                "Delete Error:",
                error
            );

            alert(
                error.message ||
                    "Unable to delete product."
            );
        } finally {
            setDeletingId(null);
        }
    };

    // ==================================================
    // DELETE ALL PRODUCTS
    // ==================================================

    const handleDeleteAll =
        async () => {
            if (products.length === 0) {
                alert(
                    "There are no products to delete."
                );

                return;
            }

            const confirmed =
                window.confirm(
                    "WARNING!\n\nThis will permanently delete ALL products.\n\nAre you sure you want to continue?"
                );

            if (!confirmed) return;

            try {
                setDeletingAll(true);

                const token =
                    localStorage.getItem(
                        "token"
                    );

                const response =
                    await fetch(
                        `${API_URL}/products/delete-all`,
                        {
                            method: "DELETE",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                            "Failed to delete all products"
                    );
                }

                alert(
                    `All products deleted successfully.\nDeleted: ${
                        data.deletedCount || 0
                    }`
                );

                setProducts([]);
            } catch (error) {
                console.error(
                    "Delete All Error:",
                    error
                );

                alert(
                    error.message ||
                        "Unable to delete all products."
                );
            } finally {
                setDeletingAll(false);
            }
        };

    // ==================================================
    // CATEGORY FILTER
    // ==================================================

    const handleCategoryChange =
        (categoryId) => {
            setSelectedCategory(
                categoryId
            );

            fetchProducts(
                categoryId
            );
        };

    // ==================================================
    // EDIT PRODUCT
    // ==================================================

    const handleEditClick =
        (product) => {
            setEditingProduct(product);

            setEditForm({
                name:
                    product.name || "",

                description:
                    product.description ||
                    "",

                category:
                    product.category?._id ||
                    product.category ||
                    "",

                price:
                    product.price ?? "",

                discountPrice:
                    product.discountPrice ??
                    "",

                material:
                    product.material || "",

                stock:
                    product.stock ?? "",

                featured:
                    product.featured ||
                    false,

                bestSeller:
                    product.bestSeller ||
                    false,

                status:
                    product.status ||
                    "Available",
            });
        };

    // ==================================================
    // EDIT FORM CHANGE
    // ==================================================

    const handleEditChange =
        (e) => {
            const {
                name,
                value,
                type,
                checked,
            } = e.target;

            setEditForm(
                (prev) => ({
                    ...prev,

                    [name]:
                        type ===
                        "checkbox"
                            ? checked
                            : value,
                })
            );
        };

    // ==================================================
    // UPDATE PRODUCT
    // ==================================================

    const handleUpdateProduct =
        async (e) => {
            e.preventDefault();

            if (!editingProduct)
                return;

            try {
                setSavingProduct(
                    true
                );

                const token =
                    localStorage.getItem(
                        "token"
                    );

                const response =
                    await fetch(
                        `${API_URL}/products/${editingProduct._id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`,
                            },

                            body: JSON.stringify({
                                name:
                                    editForm.name,

                                description:
                                    editForm.description,

                                category:
                                    editForm.category,

                                price:
                                    Number(
                                        editForm.price
                                    ),

                                discountPrice:
                                    editForm.discountPrice ===
                                    ""
                                        ? 0
                                        : Number(
                                              editForm.discountPrice
                                          ),

                                material:
                                    editForm.material,

                                stock:
                                    Number(
                                        editForm.stock
                                    ),

                                featured:
                                    editForm.featured,

                                bestSeller:
                                    editForm.bestSeller,

                                status:
                                    editForm.status,
                            }),
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                            "Failed to update product"
                    );
                }

                alert(
                    "Product updated successfully."
                );

                setEditingProduct(
                    null
                );

                fetchProducts(
                    selectedCategory
                );
            } catch (error) {
                console.error(
                    "Update Product Error:",
                    error
                );

                alert(
                    error.message ||
                        "Unable to update product."
                );
            } finally {
                setSavingProduct(
                    false
                );
            }
        };

    // ==================================================
    // CLOSE EDIT MODAL
    // ==================================================

    const closeEditModal =
        () => {
            if (savingProduct)
                return;

            setEditingProduct(
                null
            );
        };

    // ==================================================
    // INITIAL LOAD
    // ==================================================

    useEffect(() => {
        fetchCategories();
        fetchProducts("all");
        fetchCustomizationRequests();
    }, []);

    // ==================================================
    // FORMAT DATE
    // ==================================================

    const formatDate = (
        date
    ) => {
        if (!date) return "N/A";

        return new Date(
            date
        ).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    };

    return (
        <div className="admin-dashboard">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="admin-header">

                <div>
                    <h1>
                        Admin Dashboard
                    </h1>

                    <p>
                        Manage your Saajkar products
                    </p>
                </div>

                <div className="admin-actions">

                    <button
                        className="add-product-btn"
                        onClick={() =>
                            navigate(
                                "/admin/add-product"
                            )
                        }
                    >
                        + Add Product
                    </button>

                    <button
                        className="delete-all-btn"
                        onClick={
                            handleDeleteAll
                        }
                        disabled={
                            deletingAll
                        }
                    >
                        {deletingAll
                            ? "Deleting..."
                            : "Delete All Products"}
                    </button>

                </div>

            </div>


            {/* ==================================================
                INVENTORY
            ================================================== */}

            <div className="inventory-section">

                <div className="inventory-header">

                    <div>

                        <h2>
                            Inventory
                        </h2>

                        <p>
                            {products.length}{" "}
                            product
                            {products.length !==
                            1
                                ? "s"
                                : ""}
                        </p>

                    </div>

                </div>


                {/* ==================================================
                    CATEGORY FILTER
                ================================================== */}

                <div className="category-filters">

                    <button
                        className={
                            selectedCategory ===
                            "all"
                                ? "category-btn active"
                                : "category-btn"
                        }
                        onClick={() =>
                            handleCategoryChange(
                                "all"
                            )
                        }
                    >
                        All Products
                    </button>

                    {categories.map(
                        (category) => (
                            <button
                                key={
                                    category._id
                                }
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
                                {
                                    category.name
                                }
                            </button>
                        )
                    )}

                </div>


                {/* ==================================================
                    LOADING
                ================================================== */}

                {loading && (
                    <div className="status-message">
                        Loading products...
                    </div>
                )}


                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                {/* ==================================================
                    NO PRODUCTS
                ================================================== */}

                {!loading &&
                    !error &&
                    products.length ===
                        0 && (

                        <div className="empty-message">

                            <h3>
                                No products found
                            </h3>

                            <p>
                                There are no products
                                in this category.
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


                {/* ==================================================
                    PRODUCT GRID
                ================================================== */}

                {!loading &&
                    !error &&
                    products.length >
                        0 && (

                        <div className="product-grid">

                            {products.map(
                                (product) => {

                                    const image =
                                        product
                                            .images?.[0]
                                            ?.url;

                                    const sellingPrice =
                                        product.discountPrice &&
                                        product.discountPrice >
                                            0
                                            ? product.discountPrice
                                            : product.price;

                                    return (

                                        <div
                                            className="admin-product-card"
                                            key={
                                                product._id
                                            }
                                        >

                                            {/* IMAGE */}

                                            <div className="product-image-container">

                                                {image ? (

                                                    <img
                                                        src={
                                                            image
                                                        }
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


                                                {/* PRICE */}

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


                                                {/* STOCK */}

                                                <p className="stock">

                                                    Stock:{" "}

                                                    {
                                                        product.stock
                                                    }

                                                </p>


                                                {/* STATUS */}

                                                <div className="product-bottom">

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


                                                    {/* EDIT */}

                                                    <button
                                                        className="edit-btn"
                                                        onClick={() =>
                                                            handleEditClick(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>


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

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

            </div>


            {/* ==================================================
                CUSTOMIZATION REQUESTS
            ================================================== */}

            <div className="inventory-section customization-section">

                <div className="inventory-header">

                    <div>

                        <h2>
                            Customization Requests
                        </h2>

                        <p>
                            {customizationRequests.length}{" "}
                            request
                            {customizationRequests.length !==
                            1
                                ? "s"
                                : ""}
                        </p>

                    </div>

                    <button
                        className="add-product-btn"
                        onClick={
                            fetchCustomizationRequests
                        }
                        disabled={
                            customizationLoading
                        }
                    >
                        {customizationLoading
                            ? "Refreshing..."
                            : "Refresh Requests"}
                    </button>

                </div>


                {/* CUSTOMIZATION LOADING */}

                {customizationLoading && (
                    <div className="status-message">
                        Loading customization requests...
                    </div>
                )}


                {/* CUSTOMIZATION ERROR */}

                {customizationError && (
                    <div className="error-message">
                        {customizationError}
                    </div>
                )}


                {/* NO REQUESTS */}

                {!customizationLoading &&
                    !customizationError &&
                    customizationRequests.length ===
                        0 && (

                        <div className="empty-message">

                            <h3>
                                No customization requests
                            </h3>

                            <p>
                                Customer customization
                                requests will appear here.
                            </p>

                        </div>
                    )}


                {/* REQUEST CARDS */}

                {!customizationLoading &&
                    !customizationError &&
                    customizationRequests.length >
                        0 && (

                        <div className="customization-request-grid">

                            {customizationRequests.map(
                                (request) => (

                                    <div
                                        className="customization-request-card"
                                        key={
                                            request._id
                                        }
                                    >

                                        {/* REQUEST HEADER */}

                                        <div className="customization-card-header">

                                            <div>

                                                <h3>
                                                    {
                                                        request.name
                                                    }
                                                </h3>

                                                <p>
                                                    Submitted:{" "}
                                                    {formatDate(
                                                        request.createdAt
                                                    )}
                                                </p>

                                            </div>

                                            <span
                                                className={
                                                    `customization-status status-${request.status
                                                        ?.toLowerCase()
                                                        .replace(
                                                            /\s+/g,
                                                            "-"
                                                        )}`
                                                }
                                            >
                                                {
                                                    request.status
                                                }
                                            </span>

                                        </div>


                                        {/* CUSTOMER DETAILS */}

                                        <div className="customization-details">

                                            <div>
                                                <strong>
                                                    Email:
                                                </strong>

                                                <span>
                                                    {
                                                        request.email
                                                    }
                                                </span>
                                            </div>


                                            <div>
                                                <strong>
                                                    Phone:
                                                </strong>

                                                <span>
                                                    {
                                                        request.phone
                                                    }
                                                </span>
                                            </div>


                                            <div>
                                                <strong>
                                                    Jewellery Type:
                                                </strong>

                                                <span>
                                                    {
                                                        request.jewelleryType
                                                    }
                                                </span>
                                            </div>


                                            <div>
                                                <strong>
                                                    Material:
                                                </strong>

                                                <span>
                                                    {
                                                        request.material
                                                    }
                                                </span>
                                            </div>


                                            <div>
                                                <strong>
                                                    Budget:
                                                </strong>

                                                <span>
                                                    {
                                                        request.budget
                                                    }
                                                </span>
                                            </div>

                                        </div>


                                        {/* DESCRIPTION */}

                                        <div className="customization-description">

                                            <strong>
                                                Design Description
                                            </strong>

                                            <p>
                                                {
                                                    request.description
                                                }
                                            </p>

                                        </div>


                                        {/* REFERENCE IMAGES */}

                                        {request.referenceImages &&
                                            request.referenceImages.length >
                                                0 && (

                                                <div className="customization-images">

                                                    <strong>
                                                        Reference Images
                                                    </strong>

                                                    <div className="customization-image-grid">

                                                        {request.referenceImages.map(
                                                            (
                                                                image,
                                                                index
                                                            ) => (

                                                                <a
                                                                    key={
                                                                        image.public_id ||
                                                                        index
                                                                    }
                                                                    href={
                                                                        image.url
                                                                    }
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >

                                                                    <img
                                                                        src={
                                                                            image.url
                                                                        }
                                                                        alt={`Reference ${index + 1}`}
                                                                    />

                                                                </a>

                                                            )
                                                        )}

                                                    </div>

                                                </div>
                                            )}


                                        {/* STATUS UPDATE */}

                                        <div className="customization-actions">

                                            <label>
                                                Update Status
                                            </label>

                                            <select
                                                value={
                                                    request.status ||
                                                    "Pending"
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    updateCustomizationStatus(
                                                        request._id,
                                                        e.target.value
                                                    )
                                                }
                                            >

                                                <option value="Pending">
                                                    Pending
                                                </option>

                                                <option value="Contacted">
                                                    Contacted
                                                </option>

                                                <option value="In Progress">
                                                    In Progress
                                                </option>

                                                <option value="Completed">
                                                    Completed
                                                </option>

                                            </select>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>
                    )}

            </div>


            {/* ==================================================
                EDIT PRODUCT MODAL
            ================================================== */}

            {editingProduct && (

                <div
                    className="edit-modal-overlay"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closeEditModal();
                        }

                    }}
                >

                    <div
                        className="edit-modal"
                        onMouseDown={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* MODAL HEADER */}

                        <div className="edit-modal-header">

                            <div>

                                <h2>
                                    Edit Product
                                </h2>

                                <p>
                                    Update product
                                    information
                                </p>

                            </div>

                            <button
                                type="button"
                                className="close-modal-btn"
                                onClick={
                                    closeEditModal
                                }
                                disabled={
                                    savingProduct
                                }
                            >
                                ×
                            </button>

                        </div>


                        {/* EDIT FORM */}

                        <form
                            onSubmit={
                                handleUpdateProduct
                            }
                        >

                            {/* PRODUCT NAME */}

                            <label>

                                Product Name

                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        editForm.name
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    placeholder="Enter product name"
                                    required
                                />

                            </label>


                            {/* DESCRIPTION */}

                            <label>

                                Description

                                <textarea
                                    name="description"
                                    value={
                                        editForm.description
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    placeholder="Enter product description"
                                />

                            </label>


                            {/* CATEGORY */}

                            <label>

                                Category

                                <select
                                    name="category"
                                    value={
                                        editForm.category
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Category
                                    </option>

                                    {categories.map(
                                        (
                                            category
                                        ) => (

                                            <option
                                                key={
                                                    category._id
                                                }
                                                value={
                                                    category._id
                                                }
                                            >
                                                {
                                                    category.name
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </label>


                            {/* PRICE ROW */}

                            <div className="edit-form-row">

                                <label>

                                    Price

                                    <input
                                        type="number"
                                        name="price"
                                        value={
                                            editForm.price
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        min="0"
                                        placeholder="0"
                                        required
                                    />

                                </label>


                                <label>

                                    Discount Price

                                    <input
                                        type="number"
                                        name="discountPrice"
                                        value={
                                            editForm.discountPrice
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        min="0"
                                        placeholder="0"
                                    />

                                </label>

                            </div>


                            {/* STOCK + MATERIAL */}

                            <div className="edit-form-row">

                                <label>

                                    Stock

                                    <input
                                        type="number"
                                        name="stock"
                                        value={
                                            editForm.stock
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        min="0"
                                        placeholder="0"
                                        required
                                    />

                                </label>


                                <label>

                                    Material

                                    <input
                                        type="text"
                                        name="material"
                                        value={
                                            editForm.material
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        placeholder="e.g. Gold plated"
                                    />

                                </label>

                            </div>


                            {/* STATUS */}

                            <label>

                                Status

                                <select
                                    name="status"
                                    value={
                                        editForm.status
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                >

                                    <option value="Available">
                                        Available
                                    </option>

                                    <option value="Out of Stock">
                                        Out of Stock
                                    </option>

                                </select>

                            </label>


                            {/* CHECKBOXES */}

                            <div className="edit-checkboxes">

                                <label>

                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={
                                            editForm.featured
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                    />

                                    Featured Product

                                </label>


                                <label>

                                    <input
                                        type="checkbox"
                                        name="bestSeller"
                                        checked={
                                            editForm.bestSeller
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                    />

                                    Best Seller

                                </label>

                            </div>


                            {/* MODAL ACTIONS */}

                            <div className="edit-modal-actions">

                                <button
                                    type="button"
                                    className="cancel-edit-btn"
                                    onClick={
                                        closeEditModal
                                    }
                                    disabled={
                                        savingProduct
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-edit-btn"
                                    disabled={
                                        savingProduct
                                    }
                                >

                                    {savingProduct
                                        ? "Saving..."
                                        : "Save Changes"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminDashboard;
