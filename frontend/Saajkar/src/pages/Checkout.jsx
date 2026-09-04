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
    const [state, setState] = useState("Maharashtra");
    const [pincode, setPincode] = useState("");

    // Pincode validation
    const [pincodeChecking, setPincodeChecking] = useState(false);
    const [pincodeMessage, setPincodeMessage] = useState("");
    const [pincodeValid, setPincodeValid] = useState(false);

    // Payment method
    const [paymentMethod, setPaymentMethod] = useState("COD");


    // =====================================================
    // MAHARASHTRA CITIES
    // =====================================================

    const maharashtraCities = [
        "Mumbai",
        "Pune",
        "Nagpur",
        "Nashik",
        "Thane",
        "Navi Mumbai",
        "Aurangabad",
        "Kolhapur",
        "Solapur",
        "Amravati",
        "Sangli",
        "Satara",
        "Latur",
        "Akola",
        "Ahmednagar",
        "Jalgaon",
        "Nanded",
        "Dhule",
        "Ratnagiri",
        "Chandrapur",
        "Parbhani",
        "Beed",
        "Wardha",
        "Buldhana",
        "Yavatmal"
    ];


    // =====================================================
    // DELIVERY CHARGES
    // =====================================================

    const deliveryRates = {
        Mumbai: 70,
        Pune: 100
    };

    // Other Maharashtra cities get ₹100
    const deliveryCharges =
        city
            ? deliveryRates[city] || 100
            : 0;


    // =====================================================
    // GET CART FROM BACKEND
    // =====================================================

    useEffect(() => {

        const fetchCart = async () => {

            const token =
                localStorage.getItem("token");

            if (!token) {

                navigate("/login");

                return;

            }

            try {

                const response =
                    await fetch(`${API_URL}/cart`, {

                        method: "GET",

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    });


                const data =
                    await response.json();


                if (!response.ok) {

                    setError(
                        data.message ||
                        "Failed to load cart"
                    );

                    return;

                }


                setCartItems(
                    data.cart?.items || []
                );


            } catch (error) {

                console.error(
                    "Cart error:",
                    error
                );

                setError(
                    "Unable to connect to server"
                );


            } finally {

                setLoading(false);

            }

        };


        fetchCart();

    }, [navigate]);


    // =====================================================
    // CALCULATE SUBTOTAL
    // =====================================================

    const subtotal =
        cartItems.reduce(
            (sum, item) => {

                const price =
                    item.product?.discountPrice ||
                    item.product?.price ||
                    0;

                return (
                    sum +
                    Number(price) *
                    Number(item.quantity)
                );

            },
            0
        );


    // =====================================================
    // CALCULATE TOTAL
    // =====================================================

    const total =
        subtotal +
        deliveryCharges;


    // =====================================================
    // VALIDATE PINCODE
    // =====================================================

    const validatePincode = async (pin) => {

        if (pin.length !== 6) {

            setPincodeMessage("");
            setPincodeValid(false);

            return;

        }

        if (!city) {

            setPincodeMessage(
                "Please select a city first."
            );

            setPincodeValid(false);

            return;

        }


        try {

            setPincodeChecking(true);
            setPincodeMessage("");
            setPincodeValid(false);


            const response =
                await fetch(
                    `https://api.postalpincode.in/pincode/${pin}`
                );


            const data =
                await response.json();


            if (
                !data ||
                !data[0] ||
                data[0].Status !== "Success" ||
                !data[0].PostOffice ||
                data[0].PostOffice.length === 0
            ) {

                setPincodeMessage(
                    "Invalid pincode. Please enter a valid pincode."
                );

                return;

            }


            const postOffices =
                data[0].PostOffice;


            // =================================================
            // CHECK MAHARASHTRA
            // =================================================

            const isMaharashtra =
                postOffices.some(
                    (office) =>
                        office.State &&
                        office.State.toLowerCase() ===
                            "maharashtra"
                );


            if (!isMaharashtra) {

                setPincodeMessage(
                    "This pincode is not from Maharashtra."
                );

                return;

            }


            // =================================================
            // CHECK CITY / DISTRICT
            // =================================================

            const normalizedCity =
                city
                    .toLowerCase()
                    .trim();


            const cityAliases = {

                "mumbai": [
                    "mumbai",
                    "mumbai suburban",
                    "mumbai city"
                ],

                "navi mumbai": [
                    "navi mumbai",
                    "thane"
                ],

                "thane": [
                    "thane"
                ],

                "pune": [
                    "pune"
                ],

                "nagpur": [
                    "nagpur"
                ],

                "nashik": [
                    "nashik"
                ],

                "aurangabad": [
                    "aurangabad",
                    "chhatrapati sambhajinagar"
                ],

                "ahmednagar": [
                    "ahmednagar",
                    "ahilyanagar"
                ],

                "solapur": [
                    "solapur"
                ],

                "kolhapur": [
                    "kolhapur"
                ],

                "sangli": [
                    "sangli"
                ],

                "satara": [
                    "satara"
                ],

                "latur": [
                    "latur"
                ],

                "akola": [
                    "akola"
                ],

                "amravati": [
                    "amravati"
                ],

                "jalgaon": [
                    "jalgaon"
                ],

                "nanded": [
                    "nanded"
                ],

                "dhule": [
                    "dhule"
                ],

                "ratnagiri": [
                    "ratnagiri"
                ],

                "chandrapur": [
                    "chandrapur"
                ],

                "parbhani": [
                    "parbhani"
                ],

                "beed": [
                    "beed"
                ],

                "wardha": [
                    "wardha"
                ],

                "buldhana": [
                    "buldhana"
                ],

                "yavatmal": [
                    "yavatmal"
                ]

            };


            const validDistricts =
                cityAliases[normalizedCity] || [
                    normalizedCity
                ];


            const cityMatch =
                postOffices.some(
                    (office) => {

                        const district =
                            office.District
                                ?.toLowerCase()
                                .trim();

                        const name =
                            office.Name
                                ?.toLowerCase()
                                .trim();

                        return (
                            validDistricts.includes(
                                district
                            ) ||
                            validDistricts.includes(
                                name
                            )
                        );

                    }
                );


            if (!cityMatch) {

                setPincodeMessage(
                    `Pincode ${pin} does not belong to ${city}.`
                );

                setPincodeValid(false);

                return;

            }


            // =================================================
            // PINCODE VALID
            // =================================================

            setPincodeValid(true);

            setPincodeMessage(
                `✓ Pincode is valid for ${city}, Maharashtra`
            );


        } catch (error) {

            console.error(
                "Pincode validation error:",
                error
            );

            setPincodeMessage(
                "Unable to verify pincode. Please try again."
            );

            setPincodeValid(false);


        } finally {

            setPincodeChecking(false);

        }

    };


    // =====================================================
    // PLACE ORDER
    // =====================================================

    const handlePlaceOrder =
        async () => {

            const token =
                localStorage.getItem("token");


            if (!token) {

                navigate("/login");

                return;

            }


            // =================================================
            // CHECK CART
            // =================================================

            if (cartItems.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;

            }


            // =================================================
            // VALIDATE FIELDS
            // =================================================

            if (
                !fullName ||
                !phone ||
                !address ||
                !city ||
                !state ||
                !pincode
            ) {

                alert(
                    "Please fill all shipping details."
                );

                return;

            }


            // =================================================
            // PHONE VALIDATION
            // =================================================

            if (phone.length !== 10) {

                alert(
                    "Please enter a valid 10-digit phone number."
                );

                return;

            }


            // =================================================
            // PINCODE LENGTH
            // =================================================

            if (pincode.length !== 6) {

                alert(
                    "Please enter a valid 6-digit pincode."
                );

                return;

            }


            // =================================================
            // PINCODE VERIFIED
            // =================================================

            if (!pincodeValid) {

                alert(
                    "Please enter a valid pincode for the selected city."
                );

                return;

            }


            try {

                setPlacingOrder(true);


                const response =
                    await fetch(
                        `${API_URL}/orders`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify({

                                    shippingAddress: {

                                        fullName,

                                        phone,

                                        address,

                                        city,

                                        state,

                                        pincode

                                    },

                                    paymentMethod,

                                    deliveryCharges

                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Failed to place order"
                    );

                    return;

                }


                console.log(
                    "Order placed:",
                    data
                );


                // =================================================
                // PREPARE INVOICE DATA
                // =================================================

                const invoiceItems =
                    cartItems.map(
                        (item) => {

                            const product =
                                item.product;


                            const price =
                                product?.discountPrice ||
                                product?.price ||
                                0;


                            return {

                                id:
                                    item._id,

                                name:
                                    product?.name ||
                                    "Jewellery",

                                price:
                                    Number(price),

                                quantity:
                                    Number(
                                        item.quantity
                                    ) || 1,

                                image:
                                    product
                                        ?.images?.[0]?.url ||
                                    ""

                            };

                        }
                    );


                // =================================================
                // SAVE INVOICE DATA
                // =================================================

                const invoiceData = {

                    orderId:
                        data.order?._id ||
                        data.order?.orderId ||
                        "N/A",


                    orderDate:
                        new Date()
                            .toLocaleDateString(
                                "en-IN",
                                {

                                    day:
                                        "2-digit",

                                    month:
                                        "long",

                                    year:
                                        "numeric"

                                }
                            ),


                    name:
                        fullName,


                    phone:
                        phone,


                    address:
                        address,


                    city:
                        city,


                    state:
                        state,


                    pincode:
                        pincode,


                    items:
                        invoiceItems,


                    subtotal:
                        subtotal,


                    deliveryCharges:
                        deliveryCharges,


                    totalAmount:
                        total,


                    estimatedDelivery:
                        "7–8 Working Days",


                    paymentMethod:
                        paymentMethod === "COD"
                            ? "Cash on Delivery"
                            : paymentMethod

                };


                // =================================================
                // SAVE INVOICE
                // =================================================

                localStorage.setItem(
                    "orderDetails",
                    JSON.stringify(
                        invoiceData
                    )
                );


                // =================================================
                // GO TO INVOICE
                // =================================================

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


    // =====================================================
    // LOADING
    // =====================================================

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


    // =====================================================
    // ERROR
    // =====================================================

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
                CHECKOUT
            </h1>


            <div className="checkout-container">


                {/* =====================================================
                    BILLING DETAILS
                ===================================================== */}

                <div className="checkout-form">

                    <h2>
                        Billing Details
                    </h2>


                    {/* FULL NAME */}

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) =>
                            setFullName(
                                e.target.value
                            )
                        }
                    />


                    {/* PHONE */}

                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={phone}
                        maxLength="10"
                        inputMode="numeric"
                        onChange={(e) => {

                            const value =
                                e.target.value
                                    .replace(
                                        /\D/g,
                                        ""
                                    )
                                    .slice(0, 10);

                            setPhone(value);

                        }}
                    />


                    {/* ADDRESS */}

                    <textarea
                        placeholder="Address"
                        rows="3"
                        value={address}
                        onChange={(e) =>
                            setAddress(
                                e.target.value
                            )
                        }
                    ></textarea>


                    {/* =================================================
                        STATE
                    ================================================= */}

                    <select
                        value={state}
                        onChange={(e) => {

                            setState(
                                e.target.value
                            );

                            setCity("");

                            setPincode("");

                            setPincodeMessage("");

                            setPincodeValid(false);

                        }}
                    >

                        <option value="">
                            Select State
                        </option>

                        <option value="Maharashtra">
                            Maharashtra
                        </option>

                    </select>


                    {/* =================================================
                        CITY
                    ================================================= */}

                    <select
                        value={city}
                        disabled={!state}
                        onChange={(e) => {

                            setCity(
                                e.target.value
                            );

                            setPincode("");

                            setPincodeMessage("");

                            setPincodeValid(false);

                        }}
                    >

                        <option value="">
                            {state
                                ? "Select City"
                                : "Select State First"}
                        </option>


                        {state === "Maharashtra" &&
                            maharashtraCities.map(
                                (cityName) => (

                                    <option
                                        key={cityName}
                                        value={cityName}
                                    >
                                        {cityName}
                                    </option>

                                )
                            )
                        }

                    </select>


                    {/* =================================================
                        PINCODE
                    ================================================= */}

                    <input
                        type="text"
                        placeholder="Pincode"
                        value={pincode}
                        maxLength="6"
                        inputMode="numeric"
                        onChange={(e) => {

                            const value =
                                e.target.value
                                    .replace(
                                        /\D/g,
                                        ""
                                    )
                                    .slice(0, 6);

                            setPincode(value);

                            setPincodeMessage("");

                            setPincodeValid(false);


                            if (
                                value.length === 6 &&
                                city
                            ) {

                                validatePincode(
                                    value
                                );

                            }

                        }}
                    />


                    {/* PINCODE MESSAGE */}

                    {pincodeChecking && (

                        <p className="pincode-message">

                            Checking pincode...

                        </p>

                    )}


                    {!pincodeChecking &&
                        pincodeMessage && (

                            <p
                                className={
                                    pincodeValid
                                        ? "pincode-message valid"
                                        : "pincode-message invalid"
                                }
                            >

                                {pincodeMessage}

                            </p>

                        )
                    }


                    {/* =====================================================
                        DELIVERY DETAILS
                    ===================================================== */}

                    <div className="delivery-details">

                        <h2>
                            Delivery Details
                        </h2>


                        <div className="delivery-box">


                            {/* ESTIMATED DELIVERY */}

                            <div className="delivery-row">

                                <div className="delivery-text">

                                    <span className="delivery-icon">
                                        📦
                                    </span>


                                    <div>

                                        <strong>
                                            Estimated Delivery
                                        </strong>

                                        <p>
                                            7–8 Working Days
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="delivery-line"></div>


                            {/* DELIVERY CHARGES */}

                            <div className="delivery-row">

                                <div className="delivery-text">

                                    <span className="delivery-icon">
                                        🚚
                                    </span>


                                    <div>

                                        <strong>
                                            Delivery Charges
                                        </strong>

                                        <p>
                                            Maharashtra
                                        </p>

                                    </div>

                                </div>


                                <div className="selected-delivery">

                                    {city ? (

                                        <>

                                            <small>
                                                {city}
                                            </small>

                                            <strong>
                                                ₹
                                                {deliveryCharges}
                                            </strong>

                                        </>

                                    ) : (

                                        <small>
                                            Select City
                                        </small>

                                    )}

                                </div>

                            </div>


                        </div>

                    </div>

                </div>


                {/* =====================================================
                    ORDER SUMMARY
                ===================================================== */}

                <div className="order-summary">

                    <h2>
                        Order Summary
                    </h2>


                    {cartItems.length === 0 ? (

                        <p>
                            Your cart is empty.
                        </p>

                    ) : (

                        cartItems.map(
                            (item) => {

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
                                                product
                                                    ?.images?.[0]?.url
                                            }
                                            alt={
                                                product?.name
                                            }
                                        />


                                        <div>

                                            <h3>
                                                {
                                                    product?.name
                                                }
                                            </h3>


                                            <p>
                                                Price: ₹
                                                {Number(
                                                    price
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>


                                            <p>
                                                Quantity:{" "}
                                                {
                                                    item.quantity
                                                }
                                            </p>

                                        </div>


                                        <span className="item-total">

                                            ₹
                                            {(
                                                Number(
                                                    price
                                                ) *
                                                Number(
                                                    item.quantity
                                                )
                                            ).toLocaleString(
                                                "en-IN"
                                            )}

                                        </span>

                                    </div>

                                );

                            }
                        )

                    )}


                    <hr />


                    {/* SUBTOTAL */}

                    <div className="summary-row">

                        <span>
                            Subtotal
                        </span>


                        <span>

                            ₹
                            {subtotal.toLocaleString(
                                "en-IN"
                            )}

                        </span>

                    </div>


                    {/* DELIVERY */}

                    <div className="summary-row">

                        <span>
                            Delivery Charges
                        </span>


                        <span>

                            {city
                                ? `₹${deliveryCharges}`
                                : "Select City"}

                        </span>

                    </div>


                    <div className="summary-divider"></div>


                    {/* TOTAL */}

                    <div className="summary-row total-row">

                        <span>
                            Total Amount
                        </span>


                        <span>

                            ₹
                            {total.toLocaleString(
                                "en-IN"
                            )}

                        </span>

                    </div>


                    {/* =====================================================
                        PAYMENT METHOD
                    ===================================================== */}

                    <div className="payment-section">

                        <h3>
                            Payment Method
                        </h3>


                        <label>

                            <input
                                type="radio"
                                value="COD"
                                checked={
                                    paymentMethod ===
                                    "COD"
                                }
                                onChange={(e) =>
                                    setPaymentMethod(
                                        e.target.value
                                    )
                                }
                            />

                            Online Payment 

                        </label>

                    </div>


                    {/* =====================================================
                        PLACE ORDER
                    ===================================================== */}

                    <button
                        className="place-order"
                        type="button"
                        onClick={
                            handlePlaceOrder
                        }
                        disabled={
                            placingOrder ||
                            cartItems.length === 0
                        }
                    >

                        {placingOrder
                            ? "Placing Order..."
                            : "Place Order"}

                    </button>

                </div>

            </div>

        </div>

    );

};

export default Checkout;