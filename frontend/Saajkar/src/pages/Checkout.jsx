import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import API_URL from "../api/api";

const Checkout = () => {

    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [error, setError] = useState("");

    // Shipping details
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");

    // Payment method
    const [paymentMethod, setPaymentMethod] = useState("COD");


    // ==============================
    // GET CART FROM BACKEND
    // ==============================

    useEffect(() => {

        const fetchCart = async () => {

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {

                const response = await fetch(`${API_URL}/cart`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "Failed to load cart");
                    return;
                }

                setCartItems(data.cart?.items || []);

            } catch (error) {

                console.error("Cart error:", error);
                setError("Unable to connect to server");

            } finally {

                setLoading(false);

            }
        };

        fetchCart();

    }, [navigate]);


    // ==============================
    // CALCULATE TOTAL
    // ==============================

    const total = cartItems.reduce((sum, item) => {

        const price =
            item.product?.discountPrice ||
            item.product?.price ||
            0;

        return sum + Number(price) * Number(item.quantity);

    }, 0);


    // ==============================
    // PLACE ORDER
    // ==============================

    const handlePlaceOrder = async () => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }


        // Check cart
        if (cartItems.length === 0) {

            alert("Your cart is empty.");
            return;

        }


        // Validate fields
        if (
            !fullName ||
            !phone ||
            !address ||
            !city ||
            !state ||
            !pincode
        ) {

            alert("Please fill all shipping details.");
            return;

        }


        if (pincode.length !== 6) {

            alert("Please enter a valid 6-digit pincode.");
            return;

        }


        if (phone.length !== 10) {

            alert("Please enter a valid 10-digit phone number.");
            return;

        }


        try {

            setPlacingOrder(true);


            const response = await fetch(`${API_URL}/orders`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({

                    shippingAddress: {

                        fullName,
                        phone,
                        address,
                        city,
                        state,
                        pincode

                    },

                    paymentMethod

                })

            });


            const data = await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to place order"
                );

                return;

            }


            console.log("Order placed:", data);


            // Save actual backend order
            localStorage.setItem(
                "orderDetails",
                JSON.stringify(data.order)
            );


            // Go to invoice
            navigate("/invoice");

        } catch (error) {

            console.error(
                "Place order error:",
                error
            );

            alert(
                "Unable to connect to server"
            );

        } finally {

            setPlacingOrder(false);

        }

    };


    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (

            <div className="checkout-page">

                <h1>
                    Checkout
                </h1>

                <h2>
                    Loading cart...
                </h2>

            </div>

        );

    }


    // ==============================
    // ERROR
    // ==============================

    if (error) {

        return (

            <div className="checkout-page">

                <h1>
                    Checkout
                </h1>

                <h2>
                    {error}
                </h2>

            </div>

        );

    }


    return (

        <div className="checkout-page">

            <h1>
                Checkout
            </h1>


            <div className="checkout-container">


                {/* ============================= */}
                {/* SHIPPING DETAILS */}
                {/* ============================= */}

                <div className="checkout-form">

                    <h2>
                        Billing Details
                    </h2>


                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) =>
                            setFullName(e.target.value)
                        }
                    />


                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={phone}
                        maxLength="10"
                        inputMode="numeric"
                        onChange={(e) => {

                            const value =
                                e.target.value.replace(
                                    /\D/g,
                                    ""
                                );

                            setPhone(value);

                        }}
                    />


                    <textarea
                        placeholder="Address"
                        rows="3"
                        value={address}
                        onChange={(e) =>
                            setAddress(e.target.value)
                        }
                    ></textarea>


                    <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) =>
                            setCity(e.target.value)
                        }
                    />


                    <input
                        type="text"
                        placeholder="State"
                        value={state}
                        onChange={(e) =>
                            setState(e.target.value)
                        }
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

                        cartItems.map((item) => {

                            const product =
                                item.product;

                            const price =
                                product?.discountPrice ||
                                product?.price ||
                                0;

                            return (

                                <div
                                    className="order-item"
                                    key={item._id}
                                >

                                    <img
                                        src={
                                            product?.images?.[0]?.url
                                        }
                                        alt={
                                            product?.name
                                        }
                                    />


                                    <div>

                                        <h3>
                                            {product?.name}
                                        </h3>


                                        <p>
                                            Price: ₹{price}
                                        </p>


                                        <p>
                                            Quantity: {item.quantity}
                                        </p>

                                    </div>

                                </div>

                            );

                        })

                    )}


                    <hr />


                    <h2>
                        Total Amount: ₹{total}
                    </h2>


                    <button
                        className="place-order"
                        type="button"
                        onClick={handlePlaceOrder}
                        disabled={placingOrder}
                    >

                        {placingOrder
                            ? "Placing Order..."
                            : "Place Order"
                        }

                    </button>

                </div>

            </div>

        </div>

    );

};

export default Checkout;