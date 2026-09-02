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
      console.error("Error loading order details:", error);
      setOrder(null);
    }
  }, []);

  // Show message if no order is found
  if (!order) {
    return (
      <div className="invoice-page">
        <div className="invoice-box no-invoice">
          <img
            src={logo}
            alt="Saajkar Logo"
            className="invoice-logo"
          />

          <h2>No Invoice Found</h2>

          <p>
            Please place an order first to view your invoice.
          </p>
        </div>
      </div>
    );
  }

  // Make sure items is always an array
  const items = Array.isArray(order.items) ? order.items : [];

  // Calculate subtotal if it is not already stored
  const calculatedSubtotal = items.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;

    return total + price * quantity;
  }, 0);

  const subtotal =
    Number(order.subtotal) || calculatedSubtotal;

  const deliveryCharges =
    Number(order.deliveryCharges) || 0;

  const totalAmount =
    Number(order.totalAmount) || subtotal + deliveryCharges;

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

          <h1>INVOICE</h1>

          <p>JEWELLERY & ELEGANCE</p>

        </div>

        {/* ================= ORDER INFORMATION ================= */}
        <div className="invoice-info">

          <div>
            <strong>Order ID:</strong>
            <span>
              {order.orderId || "N/A"}
            </span>
          </div>

          <div>
            <strong>Order Date:</strong>
            <span>
              {order.orderDate || "N/A"}
            </span>
          </div>

        </div>

        <hr />

        {/* ================= CUSTOMER INFORMATION ================= */}
        {(order.name || order.email || order.phone) && (
          <>
            <div className="customer-info">

              <h3>Customer Details</h3>

              {order.name && (
                <p>
                  <strong>Name:</strong> {order.name}
                </p>
              )}

              {order.email && (
                <p>
                  <strong>Email:</strong> {order.email}
                </p>
              )}

              {order.phone && (
                <p>
                  <strong>Phone:</strong> {order.phone}
                </p>
              )}

            </div>

            <hr />
          </>
        )}

        {/* ================= JEWELLERY DETAILS ================= */}
        <div className="invoice-products">

          <h3>Jewellery Details</h3>

          {items.length === 0 ? (
            <p className="empty-items">
             
            </p>
          ) : (
            items.map((item, index) => {

              const price = Number(item.price) || 0;
              const quantity = Number(item.quantity) || 1;

              return (
                <div
                  className="invoice-item"
                  key={item.id || index}
                >

                  {/* Product Image */}
                  <div className="invoice-image-container">
                    <img
                      src={item.image}
                      alt={item.name || "Jewellery"}
                      className="invoice-item-image"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="invoice-item-info">

                    <h4>
                      {item.name || "Jewellery"}
                    </h4>

                    <p>
                      Quantity: {quantity}
                    </p>

                    <p>
                      Price: ₹{price.toLocaleString("en-IN")}
                    </p>

                  </div>

                  {/* Product Total */}
                  <div className="invoice-item-price">

                    ₹{(price * quantity).toLocaleString("en-IN")}

                  </div>

                </div>
              );
            })
          )}

        </div>

        <hr />

        {/* ================= PRICE DETAILS ================= */}
        <div className="invoice-total">

          <div>
            <span>Subtotal</span>

            <span>
              ₹{subtotal.toLocaleString("en-IN")}
            </span>
          </div>

          <div>
            <span>Delivery Charges</span>

            <span>
              {deliveryCharges === 0
                ? "FREE"
                : `₹${deliveryCharges.toLocaleString("en-IN")}`}
            </span>
          </div>

          <div className="final-total">

            <span>Total Amount</span>

            <span>
              ₹{totalAmount.toLocaleString("en-IN")}
            </span>

          </div>

        </div>

        {/* ================= PAYMENT INFORMATION ================= */}
        {order.paymentMethod && (
          <div className="payment-info">

            <strong>Payment Method:</strong>

            <span>
              {order.paymentMethod}
            </span>

          </div>
        )}

        {/* ================= FOOTER ================= */}
        <div className="invoice-footer">

          <p>
            Thank you for shopping with Saajkar.
          </p>

          <p>
            Your jewellery order has been placed successfully.
          </p>

          <p className="invoice-note">
            We hope you enjoy your beautiful jewellery.
          </p>

        </div>

      </div>
    </div>
  );
};

export default Invoice;
