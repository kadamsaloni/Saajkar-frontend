import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Filter.css";

const Filter = ({ closeFilter }) => {

    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState("");

    const handleApplyFilter = () => {

        if (!selectedCategory) {
            alert("Please select a category.");
            return;
        }

        navigate(
            `/collection/${selectedCategory
                .toLowerCase()
                .replace(/\s+/g, "-")}`
        );

        closeFilter();
    };

    return (
        <div className="filter-overlay">

            <div className="filter-sidebar">

                {/* HEADER */}

                <div className="filter-header">

                    <h2>Filter</h2>

                    <button
                        type="button"
                        onClick={closeFilter}
                    >
                        ✕
                    </button>

                </div>

                <hr />

                {/* PRICE */}

                <h3>Price</h3>

                <label>
                    <input type="checkbox" />
                    Under ₹500
                </label>

                <label>
                    <input type="checkbox" />
                    ₹100 - ₹200
                </label>

                <label>
                    <input type="checkbox" />
                    Above ₹20000
                </label>

                {/* CATEGORY */}

                <h3>Category</h3>

                <label>
                    <input
                        type="radio"
                        name="category"
                        value="Necklace"
                        checked={
                            selectedCategory === "Necklace"
                        }
                        onChange={(e) =>
                            setSelectedCategory(
                                e.target.value
                            )
                        }
                    />
                    Necklace
                </label>

                <label>
                    <input
                        type="radio"
                        name="category"
                        value="Earrings"
                        checked={
                            selectedCategory === "Earrings"
                        }
                        onChange={(e) =>
                            setSelectedCategory(
                                e.target.value
                            )
                        }
                    />
                    Earrings
                </label>

                <label>
                    <input
                        type="radio"
                        name="category"
                        value="Ring"
                        checked={
                            selectedCategory === "Ring"
                        }
                        onChange={(e) =>
                            setSelectedCategory(
                                e.target.value
                            )
                        }
                    />
                    Ring
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
                        checked={
                            selectedCategory ===
                            "Mangalsutra"
                        }
                        onChange={(e) =>
                            setSelectedCategory(
                                e.target.value
                            )
                        }
                    />
                    Mangalsutra
                </label>

                {/* APPLY */}

                <button
                    className="apply-btn"
                    type="button"
                    onClick={handleApplyFilter}
                >
                    Apply Filter
                </button>

            </div>

        </div>
    );
};

export default Filter;