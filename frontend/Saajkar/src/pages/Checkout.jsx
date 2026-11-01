import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const API_URL = "https://saajkar-backend.onrender.com/api";

const Checkout = () => {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("Maharashtra");
    const [pincode, setPincode] = useState("");

    const [pincodeValid, setPincodeValid] = useState(false);
    const [checkingPincode, setCheckingPincode] = useState(false);

    // Razorpay selected by default
    const [paymentMethod, setPaymentMethod] = useState("Razorpay");

    const token = localStorage.getItem("token");

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

    const deliveryRates = {
        Mumbai: 70,
        Pune: 100
    };

    const deliveryCharges = city
        ? deliveryRates[city] || 100
        : 0;

    // =========================
    // RAZORPAY SCRIPT
    // =========================

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);

            document.body.appendChild(script);
        });
    };

    // =========================
    // FETCH CART
    // =========================

    useEffect(() => {
        const fetchCart = async () => {
            try {
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(
                    `${API_URL}/cart`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to load cart"
                    );
                }

                setCartItems(
                    data.cart?.items || []
                );

            } catch (error) {
                console.error(
                    "Checkout Cart Error:",
                    error
                );

                alert(error.message);

            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [navigate, token]);

    // =========================
    // TOTAL
    // =========================

    const subtotal = cartItems.reduce(
        (total, item) => {
            const product = item.product;

            if (!product) return total;

            const price =
                product.discountPrice ||
                product.price;

            return total + price * item.quantity;
        },
        0
    );

    const totalAmount =
        subtotal + deliveryCharges;

    // =========================
    // PINCODE
    // =========================

    const validatePincode = async (pin) => {
        if (!/^\d{6}$/.test(pin)) {
            setPincodeValid(false);
            return;
        }

        if (!city) {
            setPincodeValid(false);
            return;
        }

        try {
            setCheckingPincode(true);

            const response = await fetch(
                `https://api.postalpincode.in/pincode/${pin}`
            );

            const data = await response.json();

            if (
                !data ||
                !data[0] ||
                data[0].Status !== "Success" ||
                !data[0].PostOffice
            ) {
                setPincodeValid(false);
                return;
            }

            const offices = data[0].PostOffice;

            const selectedCity =
                city.toLowerCase();

            const aliases = {
                mumbai: [
                    "mumbai",
                    "mumbai city",
                    "mumbai suburban"
                ],

                "navi mumbai": [
                    "thane",
                    "raigad",
                    "mumbai"
                ],

                aurangabad: [
                    "aurangabad",
                    "chhatrapati sambhajinagar"
                ],

                ahmednagar: [
                    "ahmednagar",
                    "ahilyanagar"
                ]
            };

            const allowed =
                aliases[selectedCity] ||
                [selectedCity];

            const match = offices.some(
                (office) => {
                    const district =
                        office.District?.toLowerCase() ||
                        "";

                    const division =
                        office.Division?.toLowerCase() ||
                        "";

                    return allowed.some(
                        (name) =>
                            district.includes(name) ||
                            division.includes(name)
                    );
                }
            );

            setPincodeValid(match);

        } catch (error) {
            console.error(
                "Pincode validation error:",
                error
            );

            setPincodeValid(false);

        } finally {
            setCheckingPincode(false);
        }
    };

    useEffect(() => {
        if (
            pincode.length === 6 &&
            city
        ) {
            validatePincode(pincode);
        } else {
            setPincodeValid(false);
        }
    }, [pincode, city]);

    // =========================
    // COD ORDER
    // =========================

    const createCODOrder = async () => {
        const response = await fetch(
            `${API_URL}/orders`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
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

                    paymentMethod: "COD",

                    deliveryCharges
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to place order"
            );
        }

        return data;
    };

    // =========================
    // RAZORPAY PAYMENT
    // =========================

    const startRazorpayPayment = async () => {

        const scriptLoaded =
            await loadRazorpayScript();

        if (!scriptLoaded) {
            throw new Error(
                "Razorpay failed to load."
            );
        }

        const response = await fetch(
            `${API_URL}/orders/create-razorpay-order`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
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

                    deliveryCharges
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Unable to create Razorpay order"
            );
        }

        const options = {
            key: data.key,

            amount: data.amount,

            currency: data.currency,

            name: "SAAJKAR",

            description:
                "Handcrafted Jewellery Purchase",

            order_id:
                data.razorpayOrderId,

            prefill: {
                name: fullName,
                contact: phone
            },

            theme: {
                color: "#800020"
            },

            handler: async (
                paymentResponse
            ) => {

                try {

                    const verifyResponse =
                        await fetch(
                            `${API_URL}/orders/verify-payment`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    Authorization:
                                        `Bearer ${token}`
                                },

                                body: JSON.stringify({
                                    razorpay_order_id:
                                        paymentResponse.razorpay_order_id,

                                    razorpay_payment_id:
                                        paymentResponse.razorpay_payment_id,

                                    razorpay_signature:
                                        paymentResponse.razorpay_signature,

                                    shippingAddress: {
                                        fullName,
                                        phone,
                                        address,
                                        city,
                                        state,
                                        pincode
                                    },

                                    deliveryCharges
                                })
                            }
                        );

                    const verifyData =
                        await verifyResponse.json();

                    if (!verifyResponse.ok) {
                        throw new Error(
                            verifyData.message ||
                            "Payment verification failed"
                        );
                    }

                    const invoiceItems =
                        cartItems.map(
                            (item) => ({
                                product:
                                    item.product,

                                quantity:
                                    item.quantity,

                                price:
                                    item.product
                                        .discountPrice ||
                                    item.product.price
                            })
                        );

                    const orderDetails = {
                        orderId:
                            verifyData.order._id,

                        items:
                            invoiceItems,

                        shippingAddress: {
                            fullName,
                            phone,
                            address,
                            city,
                            state,
                            pincode
                        },

                        subtotal,

                        deliveryCharges,

                        totalAmount,

                        paymentMethod:
                            "Razorpay",

                        isPaid: true,

                        razorpayPaymentId:
                            paymentResponse
                                .razorpay_payment_id
                    };

                    localStorage.setItem(
                        "orderDetails",
                        JSON.stringify(
                            orderDetails
                        )
                    );

                    navigate("/invoice");

                } catch (error) {

                    console.error(
                        "Payment Verification Error:",
                        error
                    );

                    alert(
                        error.message ||
                        "Payment verification failed"
                    );

                    setPlacingOrder(false);
                }
            },

            modal: {
                ondismiss: () => {
                    setPlacingOrder(false);
                }
            }
        };

        const razorpay =
            new window.Razorpay(options);

        razorpay.on(
            "payment.failed",
            (response) => {

                console.error(
                    "Razorpay Payment Failed:",
                    response.error
                );

                alert(
                    response.error?.description ||
                    "Payment failed."
                );

                setPlacingOrder(false);
            }
        );

        razorpay.open();
    };

    // =========================
    // PLACE ORDER
    // =========================

    const handlePlaceOrder = async () => {

        try {

            if (!token) {
                navigate("/login");
                return;
            }

            if (cartItems.length === 0) {
                alert("Your cart is empty.");
                return;
            }

            if (!fullName.trim()) {
                alert(
                    "Please enter your full name."
                );
                return;
            }

            if (!/^\d{10}$/.test(phone)) {
                alert(
                    "Please enter a valid 10-digit phone number."
                );
                return;
            }

            if (!address.trim()) {
                alert(
                    "Please enter your address."
                );
                return;
            }

            if (!city) {
                alert(
                    "Please select your city."
                );
                return;
            }

            if (!/^\d{6}$/.test(pincode)) {
                alert(
                    "Please enter a valid 6-digit pincode."
                );
                return;
            }

            if (!pincodeValid) {
                alert(
                    checkingPincode
                        ? "Please wait while the pincode is being verified."
                        : "The pincode does not match the selected city."
                );
                return;
            }

            setPlacingOrder(true);

            // COD
            if (paymentMethod === "COD") {

                const data =
                    await createCODOrder();

                const invoiceItems =
                    cartItems.map(
                        (item) => ({
                            product:
                                item.product,

                            quantity:
                                item.quantity,

                            price:
                                item.product
                                    .discountPrice ||
                                item.product.price
                        })
                    );

                const orderDetails = {
                    orderId:
                        data.order._id,

                    items:
                        invoiceItems,

                    shippingAddress: {
                        fullName,
                        phone,
                        address,
                        city,
                        state,
                        pincode
                    },

                    subtotal,

                    deliveryCharges,

                    totalAmount,

                    paymentMethod:
                        "COD",

                    isPaid: false
                };

                localStorage.setItem(
                    "orderDetails",
                    JSON.stringify(
                        orderDetails
                    )
                );

                navigate("/invoice");

                return;
            }

            // RAZORPAY
            if (
                paymentMethod === "Razorpay"
            ) {
                await startRazorpayPayment();
            }

        } catch (error) {

            console.error(
                "Place Order Error:",
                error
            );

            alert(
                error.message ||
                "Something went wrong."
            );

            setPlacingOrder(false);
        }
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="saajkar-checkout-page">
                <div className="checkout-message">
                    Loading checkout...
                </div>
            </div>
        );
    }

    // =========================
    // EMPTY CART
    // =========================

    if (cartItems.length === 0) {
        return (
            <div className="saajkar-checkout-page">
                <div className="checkout-message">

                    <h2>
                        Your cart is empty
                    </h2>

                    <button
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Continue Shopping
                    </button>

                </div>
            </div>
        );
    }

    // =========================
    // CHECKOUT UI
    // =========================

    return (
        <div className="saajkar-checkout-page">

            {/* PAGE HEADER */}

            <div className="checkout-header">

                <h1>Checkout</h1>

                <p>
                    Complete your order with SAAJKAR
                </p>

            </div>


            {/* MAIN CONTENT */}

            <div className="checkout-layout">

                {/* LEFT */}

                <div className="checkout-card checkout-left">

                    <h2>
                        <span>01.</span>
                        Delivery Information
                    </h2>


                    <div className="checkout-section">

                        <label>
                            Full Name *
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(e) =>
                                setFullName(
                                    e.target.value
                                )
                            }
                        />


                        <label>
                            Mobile Number *
                        </label>

                        <input
                            type="tel"
                            placeholder="Enter 10-digit mobile number"
                            value={phone}
                            maxLength="10"
                            onChange={(e) =>
                                setPhone(
                                    e.target.value
                                        .replace(
                                            /\D/g,
                                            ""
                                        )
                                )
                            }
                        />


                        <label>
                            Complete Address *
                        </label>

                        <textarea
                            placeholder="House number, street, area, landmark"
                            value={address}
                            onChange={(e) =>
                                setAddress(
                                    e.target.value
                                )
                            }
                        />


                        <label>
                            City *
                        </label>

                        <select
                            value={city}
                            onChange={(e) =>
                                setCity(
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                Select your city
                            </option>

                            {maharashtraCities.map(
                                (item) => (
                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>
                                )
                            )}

                        </select>


                        <label>
                            State *
                        </label>

                        <input
                            type="text"
                            value={state}
                            readOnly
                        />


                        <label>
                            PIN Code *
                        </label>

                        <input
                            type="text"
                            placeholder="Enter 6-digit PIN code"
                            value={pincode}
                            maxLength="6"
                            onChange={(e) =>
                                setPincode(
                                    e.target.value
                                        .replace(
                                            /\D/g,
                                            ""
                                        )
                                )
                            }
                        />


                        {checkingPincode && (
                            <p className="pincode-checking">
                                Checking PIN code...
                            </p>
                        )}


                        {!checkingPincode &&
                            pincode.length === 6 &&
                            city && (
                                <p
                                    className={
                                        pincodeValid
                                            ? "pincode-success"
                                            : "pincode-error"
                                    }
                                >
                                    {pincodeValid
                                        ? "✓ PIN code verified"
                                        : "✕ PIN code does not match selected city"}
                                </p>
                            )}

                    </div>


                    {/* PAYMENT */}

                    <div className="checkout-section">

                        <h3>
                            02. Payment Method
                        </h3>


                        <div className="payment-options">

                            <label
                                className={
                                    paymentMethod ===
                                    "Razorpay"
                                        ? "payment-option selected"
                                        : "payment-option"
                                }
                            >

                                <input
                                    type="radio"
                                    value="Razorpay"
                                    checked={
                                        paymentMethod ===
                                        "Razorpay"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                />

                                <div className="payment-info">

                                    <strong>
                                        Online Payment
                                    </strong>

                                    <p>
                                        Pay securely using Razorpay
                                    </p>

                                </div>

                                {paymentMethod ===
                                    "Razorpay" && (
                                    <span className="payment-check">
                                        ✓
                                    </span>
                                )}

                            </label>


                            <label
                                className={
                                    paymentMethod ===
                                    "COD"
                                        ? "payment-option selected"
                                        : "payment-option"
                                }
                            >

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

                                <div className="payment-info">

                                    <strong>
                                        Cash on Delivery
                                    </strong>

                                    <p>
                                        Pay when your order arrives
                                    </p>

                                </div>

                                {paymentMethod ===
                                    "COD" && (
                                    <span className="payment-check">
                                        ✓
                                    </span>
                                )}

                            </label>

                        </div>

                    </div>

                </div>


                {/* RIGHT */}

                <div className="checkout-card checkout-right">

                    <h2>
                        <span>03.</span>
                        Order Summary
                    </h2>


                    <div className="order-items">

                        {cartItems.map(
                            (item) => {

                                const product =
                                    item.product;

                                if (!product)
                                    return null;

                                const price =
                                    product.discountPrice ||
                                    product.price;

                                return (
                                    <div
                                        className="order-item"
                                        key={
                                            product._id
                                        }
                                    >

                                        <img
                                            src={
                                                product
                                                    .images?.[0]
                                                    ?.url
                                            }
                                            alt={
                                                product.name
                                            }
                                        />


                                        <div className="order-item-info">

                                            <h4>
                                                {
                                                    product.name
                                                }
                                            </h4>

                                            <p>
                                                Quantity:{" "}
                                                {
                                                    item.quantity
                                                }
                                            </p>

                                            <strong>
                                                ₹{price}
                                            </strong>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>


                    {/* TOTALS */}

                    <div className="checkout-total">

                        <div>
                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ₹{subtotal}
                            </strong>
                        </div>


                        <div>
                            <span>
                                Delivery Charges
                            </span>

                            <strong>
                                ₹{deliveryCharges}
                            </strong>
                        </div>


                        <div className="grand-total">

                            <span>
                                Total Amount
                            </span>

                            <strong>
                                ₹{totalAmount}
                            </strong>

                        </div>

                    </div>


                    {/* BUTTON */}

                    <button
                        className="place-order-btn"
                        onClick={
                            handlePlaceOrder
                        }
                        disabled={
                            placingOrder
                        }
                    >

                        {placingOrder
                            ? paymentMethod ===
                              "Razorpay"
                                ? "Opening Payment..."
                                : "Placing Order..."
                            : paymentMethod ===
                              "Razorpay"
                            ? "Pay with Razorpay"
                            : "Place Order"}

                    </button>


                    <p className="secure-payment-text">
                        🔒 Secure and safe checkout
                    </p>

                </div>

            </div>

        </div>
    );
};

export default Checkout;
