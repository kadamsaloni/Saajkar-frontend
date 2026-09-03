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


    // =====================================================
    // ALL INDIAN STATES, UNION TERRITORIES AND CITIES
    // =====================================================

    const indianStates = {

        "Andhra Pradesh": [
            "Visakhapatnam",
            "Vijayawada",
            "Guntur",
            "Nellore",
            "Kurnool",
            "Tirupati",
            "Rajahmundry",
            "Kakinada",
            "Kadapa",
            "Anantapur",
            "Chittoor",
            "Eluru",
            "Ongole",
            "Srikakulam",
            "Vizianagaram"
        ],

        "Arunachal Pradesh": [
            "Itanagar",
            "Naharlagun",
            "Tawang",
            "Pasighat",
            "Bomdila",
            "Ziro",
            "Aalo",
            "Tezu",
            "Namsai"
        ],

        "Assam": [
            "Guwahati",
            "Dibrugarh",
            "Silchar",
            "Jorhat",
            "Tezpur",
            "Nagaon",
            "Tinsukia",
            "Sivasagar",
            "Dhubri",
            "Barpeta"
        ],

        "Bihar": [
            "Patna",
            "Gaya",
            "Bhagalpur",
            "Muzaffarpur",
            "Darbhanga",
            "Purnia",
            "Ara",
            "Begusarai",
            "Katihar",
            "Munger",
            "Chapra"
        ],

        "Chhattisgarh": [
            "Raipur",
            "Bhilai",
            "Bilaspur",
            "Korba",
            "Durg",
            "Rajnandgaon",
            "Jagdalpur",
            "Ambikapur",
            "Raigarh"
        ],

        "Goa": [
            "Panaji",
            "Margao",
            "Vasco da Gama",
            "Mapusa",
            "Ponda",
            "Bicholim",
            "Curchorem"
        ],

        "Gujarat": [
            "Ahmedabad",
            "Surat",
            "Vadodara",
            "Rajkot",
            "Bhavnagar",
            "Jamnagar",
            "Gandhinagar",
            "Junagadh",
            "Anand",
            "Vapi",
            "Bharuch",
            "Navsari",
            "Morbi",
            "Mehsana",
            "Porbandar"
        ],

        "Haryana": [
            "Gurugram",
            "Faridabad",
            "Panipat",
            "Ambala",
            "Hisar",
            "Rohtak",
            "Karnal",
            "Sonipat",
            "Yamunanagar",
            "Panchkula",
            "Rewari",
            "Bhiwani"
        ],

        "Himachal Pradesh": [
            "Shimla",
            "Dharamshala",
            "Solan",
            "Mandi",
            "Kullu",
            "Manali",
            "Baddi",
            "Bilaspur",
            "Chamba",
            "Hamirpur",
            "Nahan"
        ],

        "Jharkhand": [
            "Ranchi",
            "Jamshedpur",
            "Dhanbad",
            "Bokaro",
            "Deoghar",
            "Hazaribagh",
            "Giridih",
            "Ramgarh",
            "Chaibasa"
        ],

        "Karnataka": [
            "Bengaluru",
            "Mysuru",
            "Mangaluru",
            "Hubballi",
            "Dharwad",
            "Belagavi",
            "Shivamogga",
            "Tumakuru",
            "Ballari",
            "Udupi",
            "Davangere",
            "Kalaburagi",
            "Hassan",
            "Mandya",
            "Raichur"
        ],

        "Kerala": [
            "Thiruvananthapuram",
            "Kochi",
            "Kozhikode",
            "Kollam",
            "Thrissur",
            "Kannur",
            "Alappuzha",
            "Kottayam",
            "Palakkad",
            "Malappuram",
            "Kasaragod",
            "Pathanamthitta",
            "Idukki"
        ],

        "Madhya Pradesh": [
            "Bhopal",
            "Indore",
            "Gwalior",
            "Jabalpur",
            "Ujjain",
            "Sagar",
            "Dewas",
            "Satna",
            "Ratlam",
            "Rewa",
            "Burhanpur",
            "Khandwa",
            "Chhindwara"
        ],

        "Maharashtra": [
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
        ],

        "Manipur": [
            "Imphal",
            "Thoubal",
            "Bishnupur",
            "Churachandpur",
            "Ukhrul",
            "Senapati"
        ],

        "Meghalaya": [
            "Shillong",
            "Tura",
            "Jowai",
            "Nongpoh",
            "Williamnagar",
            "Baghmara"
        ],

        "Mizoram": [
            "Aizawl",
            "Lunglei",
            "Champhai",
            "Kolasib",
            "Serchhip",
            "Saiha"
        ],

        "Nagaland": [
            "Kohima",
            "Dimapur",
            "Mokokchung",
            "Tuensang",
            "Wokha",
            "Mon",
            "Zunheboto"
        ],

        "Odisha": [
            "Bhubaneswar",
            "Cuttack",
            "Rourkela",
            "Berhampur",
            "Sambalpur",
            "Puri",
            "Balasore",
            "Baripada",
            "Bhadrak",
            "Jharsuguda",
            "Angul",
            "Bargarh"
        ],

        "Punjab": [
            "Amritsar",
            "Ludhiana",
            "Jalandhar",
            "Patiala",
            "Bathinda",
            "Mohali",
            "Pathankot",
            "Hoshiarpur",
            "Moga",
            "Batala",
            "Firozpur"
        ],

        "Rajasthan": [
            "Jaipur",
            "Jodhpur",
            "Udaipur",
            "Kota",
            "Ajmer",
            "Bikaner",
            "Alwar",
            "Bharatpur",
            "Sikar",
            "Bhilwara",
            "Sri Ganganagar",
            "Pali",
            "Chittorgarh"
        ],

        "Sikkim": [
            "Gangtok",
            "Namchi",
            "Gyalshing",
            "Mangan",
            "Ravangla"
        ],

        "Tamil Nadu": [
            "Chennai",
            "Coimbatore",
            "Madurai",
            "Tiruchirappalli",
            "Salem",
            "Tirunelveli",
            "Erode",
            "Vellore",
            "Thoothukudi",
            "Thanjavur",
            "Dindigul",
            "Tiruppur",
            "Nagercoil",
            "Kanchipuram",
            "Hosur"
        ],

        "Telangana": [
            "Hyderabad",
            "Warangal",
            "Nizamabad",
            "Karimnagar",
            "Khammam",
            "Ramagundam",
            "Mahbubnagar",
            "Nalgonda",
            "Adilabad"
        ],

        "Tripura": [
            "Agartala",
            "Udaipur",
            "Dharmanagar",
            "Kailasahar",
            "Ambassa",
            "Belonia"
        ],

        "Uttar Pradesh": [
            "Lucknow",
            "Kanpur",
            "Agra",
            "Varanasi",
            "Prayagraj",
            "Ghaziabad",
            "Noida",
            "Meerut",
            "Bareilly",
            "Aligarh",
            "Moradabad",
            "Gorakhpur",
            "Mathura",
            "Firozabad",
            "Saharanpur",
            "Jhansi",
            "Ayodhya",
            "Muzaffarnagar"
        ],

        "Uttarakhand": [
            "Dehradun",
            "Haridwar",
            "Rishikesh",
            "Haldwani",
            "Nainital",
            "Roorkee",
            "Almora",
            "Mussoorie",
            "Rudrapur",
            "Kashipur",
            "Pithoragarh"
        ],

        "West Bengal": [
            "Kolkata",
            "Howrah",
            "Durgapur",
            "Asansol",
            "Siliguri",
            "Darjeeling",
            "Kharagpur",
            "Malda",
            "Bardhaman",
            "Haldia",
            "Jalpaiguri"
        ],


        // =====================================================
        // UNION TERRITORIES
        // =====================================================

        "Andaman and Nicobar Islands": [
            "Port Blair",
            "Diglipur",
            "Mayabunder",
            "Rangat"
        ],

        "Chandigarh": [
            "Chandigarh"
        ],

        "Dadra and Nagar Haveli and Daman and Diu": [
            "Daman",
            "Diu",
            "Silvassa"
        ],

        "Delhi": [
            "New Delhi",
            "Delhi"
        ],

        "Jammu and Kashmir": [
            "Srinagar",
            "Jammu",
            "Anantnag",
            "Baramulla",
            "Kathua",
            "Udhampur",
            "Kupwara",
            "Pulwama"
        ],

        "Ladakh": [
            "Leh",
            "Kargil",
            "Nubra",
            "Diskit"
        ],

        "Lakshadweep": [
            "Kavaratti",
            "Agatti",
            "Andrott",
            "Amini",
            "Kalpeni",
            "Minicoy"
        ],

        "Puducherry": [
            "Puducherry",
            "Karaikal",
            "Mahe",
            "Yanam"
        ]
    };


    // =====================================================
    // DELIVERY CHARGES
    // =====================================================

    const deliveryRates = {

        Mumbai: 70,

        Pune: 100

    };

    // Other cities get ₹100
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


            // Check cart

            if (cartItems.length === 0) {

                alert(
                    "Your cart is empty."
                );

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

                alert(
                    "Please fill all shipping details."
                );

                return;

            }


            // Pincode validation

            if (pincode.length !== 6) {

                alert(
                    "Please enter a valid 6-digit pincode."
                );

                return;

            }


            // Phone validation

            if (phone.length !== 10) {

                alert(
                    "Please enter a valid 10-digit phone number."
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


                // =====================================================
                // PREPARE INVOICE DATA
                // =====================================================

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


                // =====================================================
                // SAVE INVOICE DATA
                // =====================================================

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


                // Save invoice

                localStorage.setItem(
                    "orderDetails",
                    JSON.stringify(
                        invoiceData
                    )
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
                                    );

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
                        STATE DROPDOWN
                    ================================================= */}

                    <select
                        value={state}
                        onChange={(e) => {

                            const selectedState =
                                e.target.value;

                            setState(
                                selectedState
                            );

                            // Reset city when state changes
                            setCity("");

                        }}
                    >

                        <option value="">
                            Select State
                        </option>


                        {Object.keys(
                            indianStates
                        ).map(
                            (stateName) => (

                                <option
                                    key={stateName}
                                    value={stateName}
                                >
                                    {stateName}
                                </option>

                            )
                        )}

                    </select>


                    {/* =================================================
                        CITY DROPDOWN
                    ================================================= */}

                    <select
                        value={city}
                        disabled={!state}
                        onChange={(e) =>
                            setCity(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            {state
                                ? "Select City"
                                : "Select State First"}
                        </option>


                        {state &&
                            indianStates[state]?.map(
                                (cityName) => (

                                    <option
                                        key={cityName}
                                        value={cityName}
                                    >
                                        {cityName}
                                    </option>

                                )
                            )}

                    </select>


                    {/* PINCODE */}

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
                                    );

                            setPincode(value);

                        }}
                    />


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
                                           
                                        </p>


                                        <p>
                                           
                                        </p>


                                        <p>
                                          
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

                            Cash on Delivery

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