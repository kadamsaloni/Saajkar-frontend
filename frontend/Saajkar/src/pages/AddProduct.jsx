import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api/api";

function AddProduct() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        discountPrice: "",
        material: "",
        stock: "",
        featured: false,
        status: "Available"
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // =========================
    // LOAD CATEGORIES
    // =========================

    useEffect(() => {

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

                console.log("Categories:", data);

                if (!response.ok) {

                    setError(
                        data.message ||
                        "Unable to load categories"
                    );

                    return;
                }

                setCategories(data.categories || []);

            } catch (err) {

                console.error(err);

                setError(
                    "Unable to connect to server"
                );

            }

        };

        fetchCategories();

    }, []);


    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setForm({
            ...form,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        });

    };


    // =========================
    // HANDLE IMAGE
    // =========================

    const handleImageChange = (e) => {

        const selectedImage =
            e.target.files[0];

        if (!selectedImage) {
            return;
        }


        // Check image type

        if (!selectedImage.type.startsWith("image/")) {

            setError(
                "Please select a valid image file."
            );

            setImage(null);
            setImagePreview("");

            return;
        }


        // Check image size - 5MB

        if (selectedImage.size > 5 * 1024 * 1024) {

            setError(
                "Image size must be less than 5MB."
            );

            setImage(null);
            setImagePreview("");

            return;
        }


        setError("");

        setImage(selectedImage);

        setImagePreview(
            URL.createObjectURL(selectedImage)
        );

    };


    // =========================
    // CREATE PRODUCT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");


        // Check image

        if (!image) {

            setError(
                "Please select a product image."
            );

            setLoading(false);

            return;
        }


        try {

            const token =
                localStorage.getItem("token");


            // =========================
            // CREATE FORMDATA
            // =========================

            const formData = new FormData();

            formData.append(
                "name",
                form.name
            );

            formData.append(
                "description",
                form.description
            );

            formData.append(
                "category",
                form.category
            );

            formData.append(
                "price",
                Number(form.price)
            );

            if (form.discountPrice) {

                formData.append(
                    "discountPrice",
                    Number(form.discountPrice)
                );

            }

            formData.append(
                "material",
                form.material
            );

            formData.append(
                "stock",
                Number(form.stock)
            );

            formData.append(
                "featured",
                form.featured
            );

            formData.append(
                "status",
                form.status
            );


            // IMPORTANT
            // This must match upload.single("image")
            formData.append(
                "image",
                image
            );


            console.log(
                "Creating product with image..."
            );


            const response = await fetch(
                `${API_URL}/products`,
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    },

                    body: formData
                }
            );


            const data =
                await response.json();


            console.log(
                "Create Product Response:",
                data
            );


            if (!response.ok) {

                setError(
                    data.message ||
                    "Product creation failed"
                );

                return;
            }


            // =========================
            // SUCCESS
            // =========================

            setMessage(
                "Product created successfully!"
            );


            // Clear form

            setForm({
                name: "",
                description: "",
                category: "",
                price: "",
                discountPrice: "",
                material: "",
                stock: "",
                featured: false,
                status: "Available"
            });


            setImage(null);
            setImagePreview("");


        } catch (err) {

            console.error(err);

            setError(
                "Unable to connect to server"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div>

            <h1>
                Add New Product
            </h1>


            {message && (

                <p style={{ color: "green" }}>
                    {message}
                </p>

            )}


            {error && (

                <p style={{ color: "red" }}>
                    {error}
                </p>

            )}


            <form onSubmit={handleSubmit}>


                {/* PRODUCT NAME */}

                <div>

                    <label>
                        Product Name
                    </label>

                    <br />

                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        required
                    />

                </div>


                <br />


                {/* DESCRIPTION */}

                <div>

                    <label>
                        Description
                    </label>

                    <br />

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Enter product description"
                        required
                    />

                </div>


                <br />


                {/* CATEGORY */}

                <div>

                    <label>
                        Category
                    </label>

                    <br />

                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                    >

                        <option value="">
                            Select Category
                        </option>

                        {categories.map(
                            (category) => (

                                <option
                                    key={category._id}
                                    value={category._id}
                                >
                                    {category.name}
                                </option>

                            )
                        )}

                    </select>

                </div>


                <br />


                {/* PRICE */}

                <div>

                    <label>
                        Price
                    </label>

                    <br />

                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        min="0"
                        required
                    />

                </div>


                <br />


                {/* DISCOUNT PRICE */}

                <div>

                    <label>
                        Discount Price
                    </label>

                    <br />

                    <input
                        type="number"
                        name="discountPrice"
                        value={form.discountPrice}
                        onChange={handleChange}
                        placeholder="Enter discount price"
                        min="0"
                    />

                </div>


                <br />


                {/* MATERIAL */}

                <div>

                    <label>
                        Material
                    </label>

                    <br />

                    <input
                        type="text"
                        name="material"
                        value={form.material}
                        onChange={handleChange}
                        placeholder="Example: Gold Plated"
                        required
                    />

                </div>


                <br />


                {/* STOCK */}

                <div>

                    <label>
                        Stock
                    </label>

                    <br />

                    <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        placeholder="Enter stock quantity"
                        min="0"
                        required
                    />

                </div>


                <br />


                {/* IMAGE */}

                <div>

                    <label>
                        Product Image
                    </label>

                    <br />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />

                </div>


                <br />


                {/* IMAGE PREVIEW */}

                {imagePreview && (

                    <div>

                        <p>
                            Image Preview:
                        </p>

                        <img
                            src={imagePreview}
                            alt="Product Preview"
                            style={{
                                width: "200px",
                                height: "200px",
                                objectFit: "cover",
                                borderRadius: "8px"
                            }}
                        />

                    </div>

                )}


                <br />


                {/* FEATURED */}

                <div>

                    <label>

                        <input
                            type="checkbox"
                            name="featured"
                            checked={form.featured}
                            onChange={handleChange}
                        />

                        Featured Product

                    </label>

                </div>


                <br />


                {/* STATUS */}

                <div>

                    <label>
                        Status
                    </label>

                    <br />

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >

                        <option value="Available">
                            Available
                        </option>

                        <option value="Out of Stock">
                            Out of Stock
                        </option>

                    </select>

                </div>


                <br />


                {/* CREATE BUTTON */}

                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Creating Product..."
                        : "Create Product"
                    }

                </button>


                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin")
                    }
                    style={{
                        marginLeft: "10px"
                    }}
                >
                    Back to Dashboard
                </button>


            </form>

        </div>

    );

}

export default AddProduct;