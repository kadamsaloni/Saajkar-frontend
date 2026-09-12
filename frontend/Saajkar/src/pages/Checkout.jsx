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

    const [paymentMethod, setPaymentMethod] = useState("COD");

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

    // ======================================================
    // LOAD RAZORPAY CHECKOUT SCRIPT
    // ======================================================

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

    // ======================================================
    // FETCH CART
    // ======================================================

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
    }, [token, navigate]);

    // ======================================================
    // CALCULATE SUBTOTAL
    // ======================================================

    const subtotal = cartItems.reduce(
        (total, item) => {
            const product = item.product;

            if (!product) {
                return total;
            }

            const price =
                product.discountPrice ||
                product.price;

            return (
                total +
                price * item.quantity
            );
        },
        0
    );

    const totalAmount =
        subtotal + deliveryCharges;

    // ======================================================
    // PINCODE VALIDATION
    // ======================================================

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

            const postOffices =
                data[0].PostOffice;

            const cityMatches =
                postOffices.some((office) => {
                    const district =
                        office.District?.toLowerCase() ||
                        "";

                    const division =
                        office.Division?.toLowerCase() ||
                        "";

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

                    return allowed.some(
                        (name) =>
                            district.includes(name) ||
                            division.includes(name)
                    );
                });

            setPincodeValid(cityMatches);

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

    // ======================================================
    // CREATE COD ORDER
    // ======================================================

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

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to place order"
            );
        }

        return data;
    };

    // ======================================================
    // START RAZORPAY PAYMENT
    // ======================================================

    const startRazorpayPayment =
        async () => {

            const scriptLoaded =
                await loadRazorpayScript();

            if (!scriptLoaded) {
                throw new Error(
                    "Razorpay failed to load. Please check your internet connection."
                );
            }

            // Create Razorpay order on backend
            const response =
                await fetch(
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

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to create Razorpay order"
                );
            }

            // Razorpay Checkout options
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
                    color: "#8B5E3C"
                },

                handler:
                    async function (
                        paymentResponse
                    ) {
                        try {
                            setPlacingOrder(
                                true
                            );

                            // Verify payment
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

                            if (
                                !verifyResponse.ok
                            ) {
                                throw new Error(
                                    verifyData.message ||
                                    "Payment verification failed"
                                );
                            }

                            // Prepare invoice items
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
                                            item.product
                                                .price
                                    })
                                );

                            const orderDetails = {
                                orderId:
                                    verifyData
                                        .order
                                        ._id,

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

                            navigate(
                                "/invoice"
                            );

                        } catch (error) {
                            console.error(
                                "Payment Verification Error:",
                                error
                            );

                            alert(
                                error.message ||
                                "Payment verification failed"
                            );

                            setPlacingOrder(
                                false
                            );
                        }
                    },

                modal: {
                    ondismiss:
                        function () {
                            setPlacingOrder(
                                false
                            );

                            alert(
                                "Payment was cancelled."
                            );
                        }
                }
            };

            const razorpay =
                new window.Razorpay(
                    options
                );

            razorpay.on(
                "payment.failed",
                function (response) {
                    console.error(
                        "Razorpay Payment Failed:",
                        response.error
                    );

                    alert(
                        response.error
                            ?.description ||
                        "Payment failed. Please try again."
                    );

                    setPlacingOrder(
                        false
                    );
                }
            );

            razorpay.open();
        };

    // ======================================================
    // PLACE ORDER
    // ======================================================

    const handlePlaceOrder =
        async () => {

            try {
                if (!token) {
                    localStorage.setItem(
                        "checkoutAfterLogin",
                        "true"
                    );

                    navigate("/login");

                    return;
                }

                if (
                    cartItems.length === 0
                ) {
                    alert(
                        "Your cart is empty."
                    );

                    return;
                }

                if (!fullName.trim()) {
                    alert(
                        "Please enter your full name."
                    );

                    return;
                }

                if (
                    !/^\d{10}$/.test(
                        phone
                    )
                ) {
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

                if (!state) {
                    alert(
                        "Please select your state."
                    );

                    return;
                }

                if (
                    !/^\d{6}$/.test(
                        pincode
                    )
                ) {
                    alert(
                        "Please enter a valid 6-digit pincode."
                    );

                    return;
                }

                if (!pincodeValid) {
                    alert(
                        checkingPincode
                            ? "Please wait while the pincode is being verified."
                            : "The pincode does not match the selected Maharashtra city."
                    );

                    return;
                }

                setPlacingOrder(true);

                // ==================================================
                // COD
                // ==================================================

                if (
                    paymentMethod ===
                    "COD"
                ) {
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
                                    item.product
                                        .price
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

                    navigate(
                        "/invoice"
                    );

                    return;
                }

                // ==================================================
                // RAZORPAY
                // ==================================================

                if (
                    paymentMethod ===
                    "Razorpay"
                ) {
                    await startRazorpayPayment();

                    return;
                }

            } catch (error) {
                console.error(
                    "Place Order Error:",
                    error
                );

                alert(
                    error.message ||
                    "Something went wrong while placing the order."
                );

                setPlacingOrder(
                    false
                );
            }
        };

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <div className="checkout-container">
                <h2>
                    Loading checkout...
                </h2>
            </div>
        );
    }

    // ======================================================
    // EMPTY CART
    // ======================================================

    if (cartItems.length === 0) {
        return (
            <div className="checkout-container">
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
        );
    }

    // ======================================================
    // CHECKOUT UI
    // ======================================================

    return (
        <div className="checkout-container">

            <div className="checkout-left">

                <h2>Checkout</h2>

                <div className="checkout-section">

                    <h3>
                        Shipping Information
                    </h3>

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

                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={phone}
                        maxLength="10"
                        onChange={(e) =>
                            setPhone(
                                e.target.value.replace(
                                    /\D/g,
                                    ""
                                )
                            )
                        }
                    />

                    <textarea
                        placeholder="Full Address"
                        value={address}
                        onChange={(e) =>
                            setAddress(
                                e.target.value
                            )
                        }
                    />

                    <select
                        value={city}
                        onChange={(e) =>
                            setCity(
                                e.target.value
                            )
                        }
                    >
                        <option value="">
                            Select City
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

                    <select
                        value={state}
                        onChange={(e) =>
                            setState(
                                e.target.value
                            )
                        }
                    >
                        <option value="Maharashtra">
                            Maharashtra
                        </option>
                    </select>

                    <input
                        type="text"
                        placeholder="Pincode"
                        value={pincode}
                        maxLength="6"
                        onChange={(e) =>
                            setPincode(
                                e.target.value.replace(
                                    /\D/g,
                                    ""
                                )
                            )
                        }
                    />

                    {checkingPincode && (
                        <p>
                            Checking pincode...
                        </p>
                    )}

                    {!checkingPincode &&
                        pincode.length === 6 &&
                        city && (
                            <p
                                style={{
                                    color:
                                        pincodeValid
                                            ? "green"
                                            : "red"
                                }}
                            >
                                {pincodeValid
                                    ? "✓ Pincode verified"
                                    : "✕ Pincode does not match selected city"}
                            </p>
                        )}

                </div>

                <div className="checkout-section">

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

                        Cash on Delivery
                    </label>

                    <label>
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

                        Online Payment
                    </label>

                </div>

            </div>

            <div className="checkout-right">

                <h3>
                    Order Summary
                </h3>

                {cartItems.map(
                    (item) => {
                        const product =
                            item.product;

                        if (!product) {
                            return null;
                        }

                        const price =
                            product.discountPrice ||
                            product.price;

                        return (
                            <div
                                className="checkout-item"
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

                                <div>
                                    <p>
                                        {
                                            product.name
                                        }
                                    </p>

                                    <p>
                                        ₹
                                        {price} ×{" "}
                                        {
                                            item.quantity
                                        }
                                    </p>
                                </div>

                            </div>
                        );
                    }
                )}

                <div className="checkout-total">

                    <div>
                        <span>
                            Subtotal
                        </span>

                        <span>
                            ₹{subtotal}
                        </span>
                    </div>

                    <div>
                        <span>
                            Delivery
                        </span>

                        <span>
                            ₹
                            {
                                deliveryCharges
                            }
                        </span>
                    </div>

                    <div>
                        <strong>
                            Total
                        </strong>

                        <strong>
                            ₹{totalAmount}
                        </strong>
                    </div>

                </div>

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

            </div>

        </div>
    );
};

export default Checkout;