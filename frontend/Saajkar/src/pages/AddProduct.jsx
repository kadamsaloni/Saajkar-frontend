import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api/api";
import "./AddProduct.css";

function AddProduct() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        discountPrice: "",
        material: "Handcrafted",
        stock: "",
        featured: false,
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [loading, setLoading] = useState(false);
    const [categoryLoading, setCategoryLoading] =
        useState(true);

    const [error, setError] = useState("");

    // =========================
    // FETCH CATEGORIES
    // =========================
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoryLoading(true);

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
                    "Category Fetch Error:",
                    error
                );

                setError(
                    "Unable to load categories."
                );
            } finally {
                setCategoryLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // =========================
    // HANDLE INPUT
    // =========================
    const handleChange = (event) => {
        const { name, value, type, checked } =
            event.target;

        setFormData((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    // =========================
    // HANDLE IMAGE
    // =========================
    const handleImageChange = (event) => {
        const selectedImage =
            event.target.files[0];

        if (!selectedImage) return;

        // Check image type
        if (
            !selectedImage.type.startsWith(
                "image/"
            )
        ) {
            setError(
                "Please select a valid image."
            );
            return;
        }

        // 5MB limit
        if (
            selectedImage.size >
            5 * 1024 * 1024
        ) {
            setError(
                "Image size must be less than 5MB."
            );
            return;
        }

        setError("");
        setImage(selectedImage);

        setImagePreview(
            URL.createObjectURL(
                selectedImage
            )
        );
    };

    // =========================
    // SUBMIT PRODUCT
    // =========================
    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        // Basic validation
        if (!formData.name.trim()) {
            setError(
                "Product name is required."
            );
            return;
        }

        if (!formData.description.trim()) {
            setError(
                "Product description is required."
            );
            return;
        }

        if (!formData.category) {
            setError(
                "Please select a category."
            );
            return;
        }

        if (!formData.price) {
            setError(
                "Product price is required."
            );
            return;
        }

        if (!formData.stock) {
            setError(
                "Product stock is required."
            );
            return;
        }

        if (!image) {
            setError(
                "Please select a product image."
            );
            return;
        }

        try {
            setLoading(true);

            const token =
                localStorage.getItem(
                    "token"
                );

            const data = new FormData();

            data.append(
                "name",
                formData.name
            );

            data.append(
                "description",
                formData.description
            );

            data.append(
                "category",
                formData.category
            );

            data.append(
                "price",
                Number(formData.price)
            );

            data.append(
                "discountPrice",
                formData.discountPrice
                    ? Number(
                          formData.discountPrice
                      )
                    : 0
            );

            data.append(
                "material",
                formData.material
            );

            data.append(
                "stock",
                Number(formData.stock)
            );

            data.append(
                "featured",
                formData.featured
            );

            data.append(
                "image",
                image
            );

            const response = await fetch(
                `${API_URL}/products`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: data,
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                        "Failed to create product"
                );
            }

            alert(
                "Product added successfully!"
            );

            navigate("/admin");

        } catch (error) {
            console.error(
                "Add Product Error:",
                error
            );

            setError(
                error.message ||
                    "Unable to add product."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-page">

            <div className="add-product-container">

                {/* HEADER */}

                <div className="add-product-header">

                    <button
                        type="button"
                        className="back-btn"
                        onClick={() =>
                            navigate("/admin")
                        }
                    >
                        ← Back to Dashboard
                    </button>

                    <h1>
                        Add New Product
                    </h1>

                    <p>
                        Add a new jewellery
                        product to your store.
                    </p>

                </div>

                {/* ERROR */}

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                {/* FORM */}

                <form
                    className="add-product-form"
                    onSubmit={handleSubmit}
                >

                    {/* PRODUCT INFORMATION */}

                    <div className="form-section">

                        <h2>
                            Product Information
                        </h2>

                        <div className="form-group">

                            <label>
                                Product Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={
                                    formData.name
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter product name"
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter product description"
                                rows="5"
                            />

                        </div>

                        <div className="form-row">

                            <div className="form-group">

                                <label>
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={
                                        formData.category
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        categoryLoading
                                    }
                                >

                                    <option value="">
                                        {categoryLoading
                                            ? "Loading categories..."
                                            : "Select Category"}
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

                            </div>

                            <div className="form-group">

                                <label>
                                    Material
                                </label>

                                <input
                                    type="text"
                                    name="material"
                                    value={
                                        formData.material
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Handcrafted"
                                />

                            </div>

                        </div>

                    </div>

                    {/* PRICE & STOCK */}

                    <div className="form-section">

                        <h2>
                            Price & Inventory
                        </h2>

                        <div className="form-row">

                            <div className="form-group">

                                <label>
                                    Price (₹)
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    value={
                                        formData.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter price"
                                    min="0"
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Discount Price (₹)
                                </label>

                                <input
                                    type="number"
                                    name="discountPrice"
                                    value={
                                        formData.discountPrice
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Optional"
                                    min="0"
                                />

                            </div>

                        </div>

                        <div className="form-group">

                            <label>
                                Stock
                            </label>

                            <input
                                type="number"
                                name="stock"
                                value={
                                    formData.stock
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter stock quantity"
                                min="0"
                            />

                        </div>

                        <label className="featured-checkbox">

                            <input
                                type="checkbox"
                                name="featured"
                                checked={
                                    formData.featured
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <span>
                                Mark as Featured Product
                            </span>

                        </label>

                    </div>

                    {/* IMAGE */}

                    <div className="form-section">

                        <h2>
                            Product Image
                        </h2>

                        <div className="image-upload">

                            <label
                                htmlFor="product-image"
                                className="upload-box"
                            >

                                {imagePreview ? (
                                    <img
                                        src={
                                            imagePreview
                                        }
                                        alt="Preview"
                                        className="image-preview"
                                    />
                                ) : (
                                    <div>
                                        <span className="upload-icon">
                                            +
                                        </span>

                                        <p>
                                            Click to
                                            upload
                                            image
                                        </p>

                                        <small>
                                            JPG, PNG,
                                            WEBP up
                                            to 5MB
                                        </small>
                                    </div>
                                )}

                            </label>

                            <input
                                id="product-image"
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleImageChange
                                }
                            />

                        </div>

                    </div>

                    {/* SUBMIT */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() =>
                                navigate(
                                    "/admin"
                                )
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Adding Product..."
                                : "Add Product"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AddProduct;