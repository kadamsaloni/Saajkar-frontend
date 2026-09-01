import React from "react";
import { useNavigate } from "react-router-dom";
import "./MyOrders.css";

function MyOrders() {
    const navigate = useNavigate();

    return (
        <div className="my-orders-page">

            <div className="my-orders-box">

                <h1>My Orders</h1>

                <div className="order-card">

                    <div className="order-top">
                        <div>
                            <span>Order ID</span>
                            <strong>SAAJ1786380426843</strong>
                        </div>

                        <div>
                            <span>Date</span>
                            <strong>10 August 2026</strong>
                        </div>
                    </div>


                    <div className="order-products">

                        <div className="product-row">
                            <span>Royal Gold Ring</span>
                            <span>₹499</span>
                        </div>

                        <div className="product-row">
                            <span>Traditional Necklace</span>
                            <span>₹999</span>
                        </div>

                    </div>


                    <div className="order-bottom">

                        <div>
                            <span>Total Amount</span>
                            <strong>₹1598</strong>
                        </div>

                        <div className="order-status">
                            Shipped
                        </div>

                    </div>


                    <div className="order-buttons">

                        <button
                            className="invoice-button"
                            onClick={() => navigate("/invoice")}
                        >
                            View Invoice
                        </button>


                        <button
                            className="track-button"
                            onClick={() => navigate("/order-tracking")}
                        >
                            Track Order
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default MyOrders;