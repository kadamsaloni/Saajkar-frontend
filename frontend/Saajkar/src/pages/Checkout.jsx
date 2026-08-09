import React, { useEffect, useState } from "react";
import "./Checkout.css";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems"));

    if (items && items.length > 0) {
      setCartItems(items);
    }
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  return (
    <div className="checkout-page">

      <h1>Checkout</h1>

      <div className="checkout-container">

        {/* Billing Details */}
        <div className="checkout-form">

          <h2>Billing Details</h2>

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
              const value = e.target.value.replace(/\D/g, "");
              setPincode(value);
            }}
          />

        </div>

        {/* Order Summary */}
        <div className="order-summary">

          <h2>Order Summary</h2>

          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item, index) => (

              <div
                className="order-item"
                key={index}
              >

                <img
                  src={item.image}
                  alt={item.name}
                />

                <div>
                  <h3>{item.name}</h3>

                  <p>
                    Price: ₹{item.price}
                  </p>
                </div>

              </div>

            ))
          )}

          <hr />

          <h2>
            Total Amount: ₹{total}
          </h2>

          <button className="place-order">
            Place Order
          </button>

        </div>

      </div>

    </div>
  );
};

export default Checkout;