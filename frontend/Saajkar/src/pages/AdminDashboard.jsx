import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api/api";

function AdminDashboard() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchProducts = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/products`,
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
                setError(data.message || "Failed to load products");
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


    useEffect(() => {
        fetchProducts();
    }, []);


    return (

        <div>

            <h1>
                Admin Dashboard
            </h1>


            <button
                onClick={() => navigate("/admin/add-product")}
            >
                + Add Product
            </button>


            <h2>
                Inventory
            </h2>


            {loading && (
                <p>Loading products...</p>
            )}


            {error && (
                <p>{error}</p>
            )}


            {!loading && !error && products.length === 0 && (
                <p>No products found.</p>
            )}


            <div>

                {products.map((product) => (

                    <div
                        key={product._id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "15px",
                            margin: "10px 0"
                        }}
                    >

                        <h3>
                            {product.name}
                        </h3>

                        <p>
                            Price: ₹
                            {product.discountPrice || product.price}
                        </p>

                        <p>
                            Stock: {product.stock}
                        </p>

                        <p>
                            Status: {product.status}
                        </p>

                    </div>

                ))}

            </div>

        </div>

    );
}

export default AdminDashboard;