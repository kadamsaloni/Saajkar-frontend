import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Filter.css";

const Filter = ({ closeFilter }) => {
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedPrice, setSelectedPrice] = useState("");

    const handleApplyFilter = () => {
        if (!selectedCategory && !selectedPrice) {
            alert("Please select a filter.");
            return;
        }

        const params = new URLSearchParams();

        if (selectedPrice) {
            params.set("price", selectedPrice);
        }

        if (selectedCategory) {
            params.set("category", selectedCategory);
        }

        // If category is selected, open its collection
        if (selectedCategory) {
            navigate(
                `/collection/${selectedCategory
                    .toLowerCase()
                    .replace(/\s+/g, "-")}?${params.toString()}`
            );
        } else {
            // If only price is selected, use all-products collection
            navigate(`/collection/all?${params.toString()}`);
        }

        if (closeFilter) {
            closeFilter();
        }
    };

    const handleClearAll = () => {
        setSelectedCategory("");
        setSelectedPrice("");
    };

    return (
        <div className="filter-overlay">

            <div className="filter-sidebar">

                <div className="filter-header">
                    <h2>Filter</h2>

                    <button
                        type="button"
                        onClick={closeFilter}
                        className="close-filter"
                    >
                        ✕
                    </button>
                </div>

                <hr />

                {/* ================= PRICE ================= */}

                <h3>Price</h3>

                <label>
                    <input
                        type="radio"
                        name="price"
                        value="under500"
                        checked={selectedPrice === "under500"}
                        onChange={(e) =>
                            setSelectedPrice(e.target.value)
                        }
                    />
                    Under ₹500
                </label>

                <label>
                    <input
                        type="radio"
                        name="price"
                        value="500-1000"
                        checked={selectedPrice === "500-1000"}
                        onChange={(e) =>
                            setSelectedPrice(e.target.value)
                        }
                    />
                    ₹500 – ₹1,000
                </label>

                <label>
                    <input
                        type="radio"
                        name="price"
                        value="1000-5000"
                        checked={selectedPrice === "1000-5000"}
                        onChange={(e) =>
                            setSelectedPrice(e.target.value)
                        }
                    />
                    ₹1,000 – ₹5,000
                </label>

                <label>
                    <input
                        type="radio"
                        name="price"
                        value="5000-10000"
                        checked={selectedPrice === "5000-10000"}
                        onChange={(e) =>
                            setSelectedPrice(e.target.value)
                        }
                    />
                    ₹5,000 – ₹10,000
                </label>

                <label>
                    <input
                        type="radio"
                        name="price"
                        value="above10000"
                        checked={selectedPrice === "above10000"}
                        onChange={(e) =>
                            setSelectedPrice(e.target.value)
                        }
                    />
                    Above ₹10,000
                </label>


                {/* ================= CATEGORY ================= */}

                <h3>Category</h3>

                <label>
                    <input
                        type="radio"
                        name="category"
                        value="Necklace"
                        checked={selectedCategory === "Necklace"}
                        onChange={(e) =>
                            setSelectedCategory(e.target.value)
                        }
                    />
                    Necklace
                </label>

                <label>
                    <input
                        type="radio"
                        name="category"
                        value="Earrings"
                        checked={selectedCategory === "Earrings"}
                        onChange={(e) =>
                            setSelectedCategory(e.target.value)
                        }
                    />
                    Earrings
                </label>

                <label>
                    <input
                        type="radio"
                        name="category"
                        value="Rings"
                        checked={selectedCategory === "Rings"}
                        onChange={(e) =>
                            setSelectedCategory(e.target.value)
                        }
                    />
                    Rings
                </label>

                <label>
                    <input
                        type="radio"
                        name="category"
                        value="Bridal"
                        checked={selectedCategory === "Bridal"}
                        onChange={(e) =>
                            setSelectedCategory(e.target.value)
                        }
                    />
                    Bridal
                </label>

                <label>
                    <input
                        type="radio"
                        name="category"
                        value="Mangalsutra"
                        checked={selectedCategory === "Mangalsutra"}
                        onChange={(e) =>
                            setSelectedCategory(e.target.value)
                        }
                    />
                    Mangalsutra
                </label>

                <label>
                    <input
                        type="radio"
                        name="category"
                        value="Nath"
                        checked={selectedCategory === "Nath"}
                        onChange={(e) =>
                            setSelectedCategory(e.target.value)
                        }
                    />
                    Nath
                </label>

                <label>
                    <input
                        type="radio"
                        name="category"
                        value="Hair Accessories"
                        checked={
                            selectedCategory === "Hair Accessories"
                        }
                        onChange={(e) =>
                            setSelectedCategory(e.target.value)
                        }
                    />
                    Hair Accessories
                </label>


                {/* ================= BUTTONS ================= */}

                <div className="filter-buttons">

                    <button
                        type="button"
                        className="apply-btn"
                        onClick={handleApplyFilter}
                    >
                        Apply Filter
                    </button>

                    <button
                        type="button"
                        className="clear-btn"
                        onClick={handleClearAll}
                    >
                        Clear All
                    </button>

                </div>

            </div>
        </div>
    );
};

export default Filter;