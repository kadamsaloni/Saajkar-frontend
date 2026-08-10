import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {

    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);

    const [pincode, setPincode] = useState("");


    // Get cart items from localStorage
    useEffect(() => {

        const items =
            JSON.parse(localStorage.getItem("cartItems")) || [];

        setCartItems(items);

    }, []);


    // Calculate subtotal
    const total = cartItems.reduce(
        (sum, item) => sum + Number(item.price),
        0
    );


    // ==============================
    // PLACE ORDER
    // ==============================

    const handlePlaceOrder = () => {

        // Check cart
        if (cartItems.length === 0) {

            alert("Your cart is empty.");

            return;
        }


        // Delivery charge
        const deliveryCharges = 100;


        // Create order
        const orderDetails = {

            orderId:
                "SAAJ" + Date.now(),

            orderDate:
                new Date().toLocaleDateString("en-IN"),

            items:
                cartItems,

            subtotal:
                total,

            deliveryCharges:
                deliveryCharges,

            totalAmount:
                total + deliveryCharges

        };


        // Save order details
        localStorage.setItem(
            "orderDetails",
            JSON.stringify(orderDetails)
        );


        // Go to Invoice page
        navigate("/invoice");

    };


    return (

        <div className="checkout-page">


            {/* ============================= */}
            {/* CHECKOUT HEADING */}
            {/* ============================= */}

            <h1>
                Checkout
            </h1>


            <div className="checkout-container">


                {/* ============================= */}
                {/* BILLING DETAILS */}
                {/* ============================= */}

                <div className="checkout-form">

                    <h2>
                        Billing Details
                    </h2>


                    <input
                        type="text"
                        placeholder="Full Name"
                    />


                    <input
                        type="email"
                        placeholder="Email Address"
                    />


                    <input
                        type="tel"
                        placeholder="Phone Number"
                    />


                    <textarea
                        placeholder="Address"
                        rows="3"
                    ></textarea>


                    <input
                        type="text"
                        placeholder="Landmark"
                    />


                    <input
                        type="text"
                        placeholder="Pincode"
                        value={pincode}
                        maxLength="6"
                        inputMode="numeric"
                        onChange={(e) => {

                            const value =
                                e.target.value.replace(
                                    /\D/g,
                                    ""
                                );

                            setPincode(value);

                        }}
                    />

                </div>


                {/* ============================= */}
                {/* ORDER SUMMARY */}
                {/* ============================= */}

                <div className="order-summary">

                    <h2>
                        Order Summary
                    </h2>


                    {cartItems.length === 0 ? (

                        <p>
                            Your cart is empty.
                        </p>

                    ) : (

                        cartItems.map((item, index) => (

                            <div
                                className="order-item"
                                key={item.id || index}
                            >

                                <img
                                    src={item.image}
                                    alt={item.name}
                                />


                                <div>

                                    <h3>
                                        {item.name}
                                    </h3>


                                    <p>
                                        Price: ₹{item.price}
                                    </p>

                                </div>

                            </div>

                        ))

                    )}


                    <hr />
                  {/* Total */}

                    <h2>
                        Total Amount: ₹{total }
                    </h2>


                    {/* Place Order */}

                    <button
                        className="place-order"
                        type="button"
                        onClick={handlePlaceOrder}
                    >
                        Place Order
                    </button>

                </div>

            </div>

        </div>

    );

};

export default Checkout;