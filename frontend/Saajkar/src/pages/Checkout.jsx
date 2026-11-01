import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api/api";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Razorpay selected by default
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
  });

  const [pincodeValid, setPincodeValid] = useState(false);
  const [pincodeMessage, setPincodeMessage] = useState("");
  const [checkingPincode, setCheckingPincode] = useState(false);

  const cities = [
    "Mumbai",
    "Navi Mumbai",
    "Thane",
    "Pune",
    "Nashik",
    "Nagpur",
    "Aurangabad",
    "Ahmednagar",
    "Kolhapur",
    "Solapur",
    "Other",
  ];

  // ==========================================
  // PRODUCT HELPERS
  // ==========================================

  const getProduct = (item) => {
    return item.product || item.productId || item;
  };

  const getQuantity = (item) => {
    return Number(item.quantity || 1);
  };

  const getPrice = (item) => {
    const product = getProduct(item);

    return Number(
      product.discountPrice ||
      product.price ||
      0
    );
  };

  const getProductName = (item) => {
    const product = getProduct(item);

    return (
      product.name ||
      product.title ||
      "Jewellery Product"
    );
  };

  // FIXED PRODUCT IMAGE
  const getProductImage = (item) => {
    const product = getProduct(item);

    if (
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      const firstImage = product.images[0];

      // If backend returns a direct URL
      if (typeof firstImage === "string") {
        return firstImage;
      }

      // If backend returns:
      // { public_id: "...", url: "..." }
      if (
        firstImage &&
        typeof firstImage === "object"
      ) {
        return firstImage.url || "";
      }
    }

    return (
      product.image ||
      product.imageUrl ||
      product.img ||
      ""
    );
  };

  // ==========================================
  // FETCH CART
  // ==========================================

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!token) {
          alert(
            "Please login to continue with checkout."
          );

          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_URL}/cart`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to fetch cart."
          );
        }

        const items = Array.isArray(data)
          ? data
          : data.cart?.items ||
            data.items ||
            data.cart ||
            [];

        setCartItems(items);
      } catch (error) {
        console.error(
          "Cart error:",
          error
        );

        alert(
          error.message ||
            "Unable to load your cart."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token, navigate]);

  // ==========================================
  // SUBTOTAL
  // ==========================================

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => {
        return (
          total +
          getPrice(item) *
            getQuantity(item)
        );
      },
      0
    );
  }, [cartItems]);

  // ==========================================
  // DELIVERY CHARGES
  // ==========================================

  const deliveryCharges = useMemo(() => {
    if (!formData.city) {
      return 0;
    }

    if (formData.city === "Mumbai") {
      return 70;
    }

    if (formData.city === "Pune") {
      return 100;
    }

    return 100;
  }, [formData.city]);

  const totalAmount =
    subtotal + deliveryCharges;

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name === "pincode") {
      setPincodeValid(false);
      setPincodeMessage("");
    }
  };

  // ==========================================
  // PINCODE VALIDATION
  // ==========================================

  const validatePincode = async () => {
    const pin =
      formData.pincode.trim();

    if (!/^\d{6}$/.test(pin)) {
      setPincodeValid(false);

      setPincodeMessage(
        "Please enter a valid 6-digit PIN code."
      );

      return;
    }

    try {
      setCheckingPincode(true);
      setPincodeValid(false);

      setPincodeMessage(
        "Checking PIN code..."
      );

      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pin}`
      );

      const data =
        await response.json();

      if (
        data[0]?.Status === "Success" &&
        data[0]?.PostOffice?.length > 0
      ) {
        const postOffice =
          data[0].PostOffice[0];

        const district =
          postOffice.District || "";

        const division =
          postOffice.Division || "";

        const enteredCity =
          formData.city.toLowerCase();

        const cityAliases = {
          mumbai: ["mumbai"],

          "navi mumbai": [
            "navi mumbai",
            "thane",
            "raigad",
          ],

          thane: ["thane"],

          pune: ["pune"],

          nashik: ["nashik"],

          nagpur: ["nagpur"],

          aurangabad: [
            "aurangabad",
            "chhatrapati sambhajinagar",
          ],

          ahmednagar: [
            "ahmednagar",
            "ahilyanagar",
          ],

          kolhapur: ["kolhapur"],

          solapur: ["solapur"],

          other: [],
        };

        const allowedNames =
          cityAliases[
            enteredCity
          ] || [];

        const actualLocation =
          `${district} ${division}`
            .toLowerCase();

        const cityMatches =
          enteredCity === "other" ||
          allowedNames.some(
            (name) =>
              actualLocation.includes(
                name
              )
          );

        if (cityMatches) {
          setPincodeValid(true);

          setPincodeMessage(
            `PIN code verified: ${postOffice.Name}, ${district}.`
          );
        } else {
          setPincodeValid(false);

          setPincodeMessage(
            `This PIN code belongs to ${district}. Please check your selected city.`
          );
        }
      } else {
        setPincodeValid(false);

        setPincodeMessage(
          "Invalid PIN code. Please enter a valid PIN code."
        );
      }
    } catch (error) {
      console.error(
        "PIN code validation error:",
        error
      );

      setPincodeValid(false);

      setPincodeMessage(
        "Unable to verify PIN code. Please check your internet connection."
      );
    } finally {
      setCheckingPincode(false);
    }
  };

  // ==========================================
  // FORM VALIDATION
  // ==========================================

  const validateForm = () => {
    if (!cartItems.length) {
      alert("Your cart is empty.");
      return false;
    }

    if (!formData.fullName.trim()) {
      alert(
        "Please enter your full name."
      );

      return false;
    }

    if (
      !/^[6-9]\d{9}$/.test(
        formData.phone.trim()
      )
    ) {
      alert(
        "Please enter a valid 10-digit mobile number."
      );

      return false;
    }

    if (!formData.address.trim()) {
      alert(
        "Please enter your complete address."
      );

      return false;
    }

    if (!formData.city) {
      alert(
        "Please select your city."
      );

      return false;
    }

    if (!formData.state.trim()) {
      alert(
        "Please enter your state."
      );

      return false;
    }

    if (
      !/^\d{6}$/.test(
        formData.pincode.trim()
      )
    ) {
      alert(
        "Please enter a valid 6-digit PIN code."
      );

      return false;
    }

    if (!pincodeValid) {
      alert(
        "Please verify your PIN code before placing the order."
      );

      return false;
    }

    return true;
  };

  // ==========================================
  // SAVE INVOICE
  // ==========================================

  const saveInvoiceDetails = (
    order,
    isPaid
  ) => {
    const invoiceItems =
      cartItems.map((item) => {
        const product =
          getProduct(item);

        return {
          productId:
            product._id ||
            product.id,

          name:
            getProductName(item),

          image:
            getProductImage(item),

          price:
            getPrice(item),

          quantity:
            getQuantity(item),
        };
      });

    const orderDetails = {
      orderId:
        order._id ||
        order.id,

      items: invoiceItems,

      shippingAddress: {
        fullName:
          formData.fullName,

        phone:
          formData.phone,

        address:
          formData.address,

        city:
          formData.city,

        state:
          formData.state,

        pincode:
          formData.pincode,
      },

      subtotal,

      deliveryCharges,

      totalAmount,

      paymentMethod,

      isPaid,

      orderDate:
        new Date().toISOString(),
    };

    localStorage.setItem(
      "orderDetails",
      JSON.stringify(orderDetails)
    );

    navigate("/invoice");
  };

  // ==========================================
  // CASH ON DELIVERY
  // ==========================================

  const handleCOD = async () => {
    const response =
      await fetch(
        `${API_URL}/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            shippingAddress:
              formData,

            paymentMethod:
              "COD",

            deliveryCharges,
          }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to place COD order."
      );
    }

    const order =
      data.order || data;

    if (
      !order._id &&
      !order.id
    ) {
      throw new Error(
        "Order was submitted, but the server did not return an order ID. Please contact support before placing another order."
      );
    }

    saveInvoiceDetails(
      order,
      false
    );
  };

  // ==========================================
  // LOAD RAZORPAY
  // ==========================================

  const loadRazorpayScript = () => {
    return new Promise(
      (resolve) => {
        const existingScript =
          document.querySelector(
            'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
          );

        if (existingScript) {
          resolve(true);
          return;
        }

        const script =
          document.createElement(
            "script"
          );

        script.src =
          "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () =>
          resolve(true);

        script.onerror = () =>
          resolve(false);

        document.body.appendChild(
          script
        );
      }
    );
  };

  // ==========================================
  // RAZORPAY PAYMENT
  // ==========================================

  const handleRazorpay =
    async () => {
      const scriptLoaded =
        await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error(
          "Unable to load Razorpay. Please try again."
        );
      }

      // Create Razorpay order
      const response =
        await fetch(
          `${API_URL}/orders/create-razorpay-order`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              shippingAddress:
                formData,

              deliveryCharges,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to create payment order."
        );
      }

      const razorpayOrder =
        data.order || data;

      const razorpayKey =
        data.key ||
        import.meta.env
          .VITE_RAZORPAY_KEY_ID;

      if (
        !razorpayOrder.id ||
        !razorpayKey
      ) {
        throw new Error(
          "Razorpay order details or key are missing. Please check your backend configuration."
        );
      }

      // Razorpay options
      const options = {
        key: razorpayKey,

        amount:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency ||
          "INR",

        name: "SAAJKAR",

        description:
          "Payment for your jewellery order",

        order_id:
          razorpayOrder.id,

        prefill: {
          name:
            formData.fullName,

          contact:
            formData.phone,
        },

        theme: {
          color: "#4A120D",
        },

        handler:
          async (
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
                        `Bearer ${token}`,
                    },

                    body: JSON.stringify(
                      {
                        razorpay_order_id:
                          paymentResponse.razorpay_order_id,

                        razorpay_payment_id:
                          paymentResponse.razorpay_payment_id,

                        razorpay_signature:
                          paymentResponse.razorpay_signature,

                        shippingAddress:
                          formData,

                        deliveryCharges,
                      }
                    ),
                  }
                );

              const verifyData =
                await verifyResponse.json();

              if (
                !verifyResponse.ok
              ) {
                throw new Error(
                  verifyData.message ||
                    "Payment verification failed."
                );
              }

              const verifiedOrder =
                verifyData.order ||
                verifyData;

              if (
                !verifiedOrder._id &&
                !verifiedOrder.id
              ) {
                throw new Error(
                  "Payment was received, but the server did not return the order ID. Please contact support."
                );
              }

              saveInvoiceDetails(
                verifiedOrder,
                true
              );
            } catch (error) {
              console.error(
                "Payment verification error:",
                error
              );

              alert(
                error.message ||
                  "Payment verification failed."
              );

              setPlacingOrder(
                false
              );
            }
          },

        modal: {
          ondismiss: () => {
            setPlacingOrder(
              false
            );
          },
        },
      };

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.on(
        "payment.failed",
        (paymentError) => {
          console.error(
            "Razorpay payment failed:",
            paymentError
          );

          alert(
            paymentError.error
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

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handlePlaceOrder =
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      try {
        setPlacingOrder(true);

        if (
          paymentMethod === "COD"
        ) {
          await handleCOD();
        } else {
          await handleRazorpay();
        }
      } catch (error) {
        console.error(
          "Order error:",
          error
        );

        alert(
          error.message ||
            "Something went wrong. Please try again."
        );

        setPlacingOrder(false);
      }
    };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="checkout-loading">
        <div className="checkout-spinner"></div>

        <p>
          Loading your checkout...
        </p>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="checkout-page">

      <div className="checkout-heading">

        <h1>
          Checkout
        </h1>

        <p>
          Complete your order with SAAJKAR
        </p>

      </div>

      {cartItems.length === 0 ? (

        <div className="empty-checkout">

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add some beautiful jewellery
            to continue.
          </p>

          <button
            onClick={() =>
              navigate("/")
            }
            className="continue-shopping"
          >
            Continue Shopping
          </button>

        </div>

      ) : (

        <form
          className="checkout-container"
          onSubmit={handlePlaceOrder}
        >

          {/* =================================
              LEFT SIDE
          ================================= */}

          <div className="checkout-left">

            {/* DELIVERY INFORMATION */}

            <section className="checkout-section">

              <h2>
                01. Delivery Information
              </h2>

              <div className="checkout-input-group">

                <label>
                  Full Name *
                </label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={
                    formData.fullName
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              <div className="checkout-input-group">

                <label>
                  Mobile Number *
                </label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                  value={
                    formData.phone
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              <div className="checkout-input-group">

                <label>
                  Complete Address *
                </label>

                <textarea
                  name="address"
                  placeholder="House number, street, area, landmark"
                  rows="4"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
                  required
                ></textarea>

              </div>

              <div className="checkout-input-group">

                <label>
                  City *
                </label>

                <select
                  name="city"
                  value={
                    formData.city
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="">
                    Select your city
                  </option>

                  {cities.map(
                    (city) => (
                      <option
                        key={city}
                        value={city}
                      >
                        {city}
                      </option>
                    )
                  )}

                </select>

              </div>

              <div className="checkout-input-group">

                <label>
                  State *
                </label>

                <input
                  type="text"
                  name="state"
                  value={
                    formData.state
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              <div className="checkout-input-group">

                <label>
                  PIN Code *
                </label>

                <div className="pincode-row">

                  <input
                    type="text"
                    name="pincode"
                    placeholder="Enter 6-digit PIN code"
                    maxLength="6"
                    value={
                      formData.pincode
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                  <button
                    type="button"
                    className="verify-pincode-btn"
                    onClick={
                      validatePincode
                    }
                    disabled={
                      checkingPincode
                    }
                  >
                    {checkingPincode
                      ? "Checking..."
                      : "Verify"}
                  </button>

                </div>

                {pincodeMessage && (

                  <p
                    className={`pincode-message ${
                      pincodeValid
                        ? "success"
                        : "error"
                    }`}
                  >
                    {pincodeMessage}
                  </p>

                )}

              </div>

            </section>


            {/* =================================
                PAYMENT METHOD
            ================================= */}

            <section className="checkout-section payment-section">

              <h2>
                02. Payment Method
              </h2>

              <div className="payment-options">

                {/* COD */}

                <label
                  className={`payment-option ${
                    paymentMethod ===
                    "COD"
                      ? "selected"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
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

                  <span className="payment-icon">
                    💵
                  </span>

                  <span className="payment-info">

                    <strong>
                      Cash on Delivery
                    </strong>

                    <small>
                      Pay when your order arrives
                    </small>

                  </span>

                  <span className="payment-radio"></span>

                </label>


                {/* RAZORPAY */}

                <label
                  className={`payment-option ${
                    paymentMethod ===
                    "Razorpay"
                      ? "selected"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
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

                  <span className="payment-icon">
                    💳
                  </span>

                  <span className="payment-info">

                    <strong>
                      Online Payment
                    </strong>

                    <small>
                      Secure payment using Razorpay
                    </small>

                  </span>

                  <span className="payment-radio"></span>

                </label>

              </div>

              <p className="secure-payment-text">
                Your payment and personal information are protected.
              </p>

            </section>

          </div>


          {/* =================================
              RIGHT SIDE - ORDER SUMMARY
          ================================= */}

          <div className="checkout-right">

            <section className="order-summary">

              <h2>
                Order Summary
              </h2>


              <div className="summary-products">

                {cartItems.map(
                  (item, index) => (

                    <div
                      className="summary-product"
                      key={
                        item._id ||
                        item.productId?._id ||
                        item.product?._id ||
                        index
                      }
                    >

                      {/* PRODUCT IMAGE */}

                      <div className="summary-product-image">

                        {getProductImage(
                          item
                        ) ? (

                          <img
                            src={getProductImage(
                              item
                            )}
                            alt={getProductName(
                              item
                            )}
                          />

                        ) : (

                          <div className="image-placeholder">
                            SAAJKAR
                          </div>

                        )}

                      </div>


                      {/* PRODUCT DETAILS */}

                      <div className="summary-product-details">

                        <h4>
                          {getProductName(
                            item
                          )}
                        </h4>

                        <p>
                          Quantity:{" "}
                          {getQuantity(
                            item
                          )}
                        </p>

                        <strong>
                          ₹
                          {(
                            getPrice(
                              item
                            ) *
                            getQuantity(
                              item
                            )
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                    </div>

                  )
                )}

              </div>


              <div className="summary-divider"></div>


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

                  {formData.city
                    ? `₹${deliveryCharges}`
                    : "Select city"}

                </span>

              </div>


              <div className="summary-divider"></div>


              {/* TOTAL */}

              <div className="summary-total">

                <strong>
                  Total Amount
                </strong>

                <strong>
                  ₹
                  {totalAmount.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>


              {/* PLACE ORDER */}

              <button
                type="submit"
                className="place-order-btn"
                disabled={
                  placingOrder ||
                  !cartItems.length
                }
              >

                {placingOrder
                  ? "Processing..."
                  : paymentMethod ===
                    "COD"
                  ? "Place Order"
                  : "Pay with Razorpay"}

              </button>


              <p className="order-note">
                By placing your order, you agree to our terms and conditions.
              </p>

            </section>

          </div>

        </form>

      )}

    </div>
  );
};

export default Checkout;
