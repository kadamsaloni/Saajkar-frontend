import React, { useEffect, useState } from "react";
import "./Invoice.css";
import logo from "../assets/saajkar-logo.png";
const Invoice = () => {

    const [order, setOrder] = useState(null);

    useEffect(() => {

        try {

            const savedOrder = localStorage.getItem("orderDetails");

            if (savedOrder) {

                const parsedOrder = JSON.parse(savedOrder);

                setOrder(parsedOrder);

            }

        } catch (error) {

            console.error("Error loading order:", error);

            setOrder(null);

        }

    }, []);


    // If no order exists
    if (!order) {

        return (
            <div className="invoice-page">

                <div className="invoice-box">

                    <h2>
                        No Invoice Found
                    </h2>

                    <p>
                        Please place an order first.
                    </p>

                </div>

            </div>
        );

    }


    // Make sure items is always an array
    const items = Array.isArray(order.items)
        ? order.items
        : [];


    return (

        <div className="invoice-page">

            <div className="invoice-box">


                {/* ================= HEADER ================= */}

               <div className="invoice-header">

    <img
        src={logo}
        alt="Saajkar Logo"
        className="invoice-logo"
    />

    <p>JEWELLERY & ELEGANCE</p>

    <h2></h2>

</div>


                {/* ================= ORDER INFORMATION ================= */}

                <div className="invoice-info">

                    <div>

                        <strong>
                            Order ID:
                        </strong>

                        <span>
                            {order.orderId || "N/A"}
                        </span>

                    </div>


                    <div>

                        <strong>
                            Order Date:
                        </strong>

                        <span>
                            {order.orderDate || "N/A"}
                        </span>

                    </div>

                </div>


                <hr />


                {/* ================= JEWELLERY ================= */}

                <div className="invoice-products">

                    <h3>
                        Jewellery Details
                    </h3>


                    {
                        items.length === 0 ? (

                            <p>
                                No jewellery items found.
                            </p>

                        ) : (

                            items.map((item, index) => (

                                <div
                                    className="invoice-item"
                                    key={item.id || index}
                                >

                                    <img
                                        src={item.image}
                                        alt={item.name || "Jewellery"}
                                    />


                                    <div className="invoice-item-info">

                                        <h4>
                                            {item.name || "Jewellery"}
                                        </h4>


                                        <p>
                                            Quantity: 1
                                        </p>

                                    </div>


                                    <div className="invoice-item-price">

                                        ₹{Number(item.price) || 0}

                                    </div>

                                </div>

                            ))

                        )
                    }

                </div>


                <hr />


                {/* ================= PRICE DETAILS ================= */}

                <div className="invoice-total">

                    <div>

                        <span>
                            Subtotal
                        </span>

                        <span>
                            ₹{Number(order.subtotal) || 0}
                        </span>

                    </div>


                    <div>

                        <span>
                            Delivery Charges
                        </span>

                        <span>
                            ₹{Number(order.deliveryCharges) || 0}
                        </span>

                    </div>


                    <div className="final-total">

                        <span>
                            Total Amount
                        </span>

                        <span>
                            ₹{Number(order.totalAmount) || 0}
                        </span>

                    </div>

                </div>


                {/* ================= FOOTER ================= */}

                <div className="invoice-footer">

                    <p>
                        Thank you for shopping with Saajkar.
                    </p>

                    <p>
                        Your jewellery order has been placed successfully.
                    </p>

                </div>


            </div>

        </div>

    );

};

export default Invoice;