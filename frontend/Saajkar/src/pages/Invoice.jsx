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

  const items = Array.isArray(order.items) ? order.items : [];

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
    Number(order.totalAmount) ||
    subtotal + deliveryCharges;

  return (
    <div className="invoice-page">
      <div className="invoice-box">

        {/* HEADER */}
        <div className="invoice-header">
          <img
            src={logo}
            alt="Saajkar Logo"
            className="invoice-logo"
          />

          <h1>INVOICE</h1>

          <p>JEWELLERY & ELEGANCE</p>
        </div>

        {/* ORDER INFORMATION */}
        <div className="invoice-info">

          <div>
            <strong>Order ID</strong>
            <span>{order.orderId || "N/A"}</span>
          </div>

          <div>
            <strong>Order Date</strong>
            <span>{order.orderDate || "N/A"}</span>
          </div>

        </div>

        {/* CUSTOMER INFORMATION */}
        {(order.name ||
          order.email ||
          order.phone) && (
          <div className="customer-info">

            <h3>Customer Details</h3>

            {order.name && (
              <p>
                <strong>Name:</strong>{" "}
                {order.name}
              </p>
            )}

            {order.email && (
              <p>
                <strong>Email:</strong>{" "}
                {order.email}
              </p>
            )}

            {order.phone && (
              <p>
                <strong>Phone:</strong>{" "}
                {order.phone}
              </p>
            )}

          </div>
        )}

        {/* PRODUCTS */}
        <div className="invoice-products">

          <h3>Jewellery Details</h3>

          {items.length === 0 ? (
            <p className="empty-items">
              No jewellery items found.
            </p>
          ) : (

            items.map((item, index) => {

              const price =
                Number(item.price) || 0;

              const quantity =
                Number(item.quantity) || 1;

              const itemTotal =
                price * quantity;

              /*
                Get product image from different
                possible image fields.
              */
              let productImage = "";

              if (item.image) {
                productImage = item.image;
              } else if (item.imageUrl) {
                productImage = item.imageUrl;
              } else if (
                item.images &&
                Array.isArray(item.images) &&
                item.images.length > 0
              ) {
                if (
                  typeof item.images[0] === "string"
                ) {
                  productImage = item.images[0];
                } else {
                  productImage =
                    item.images[0]?.url || "";
                }
              }

              return (
                <div
                  className="invoice-item"
                  key={item.id || item._id || index}
                >

                  {/* PRODUCT IMAGE */}
                  <div className="invoice-image-container">

                    {productImage ? (
                      <img
                        src={productImage}
                        alt={
                          item.name ||
                          "Jewellery"
                        }
                        className="invoice-item-image"
                        onError={(e) => {
                          e.target.style.display =
                            "none";

                          e.target.parentElement.classList.add(
                            "image-error"
                          );
                        }}
                      />
                    ) : (
                      <div className="image-placeholder">
                        No Image
                      </div>
                    )}

                  </div>

                  {/* PRODUCT DETAILS */}
                  <div className="invoice-item-info">

                    <h4>
                      {item.name ||
                        "Jewellery"}
                    </h4>

                    <p>
                      Quantity: {quantity}
                    </p>

                    <p>
                      Price: ₹
                      {price.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                  {/* ITEM TOTAL */}
                  <div className="invoice-item-price">
                    ₹
                    {itemTotal.toLocaleString(
                      "en-IN"
                    )}
                  </div>

                </div>
              );
            })
          )}

        </div>

        {/* TOTAL */}
        <div className="invoice-total">

          <div>
            <span>Subtotal</span>

            <span>
              ₹
              {subtotal.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>

          <div>
            <span>Delivery Charges</span>

            <span>
              {deliveryCharges === 0
                ? "FREE"
                : `₹${deliveryCharges.toLocaleString(
                    "en-IN"
                  )}`}
            </span>
          </div>

          <div className="final-total">

            <span>Total Amount</span>

            <span>
              ₹
              {totalAmount.toLocaleString(
                "en-IN"
              )}
            </span>

          </div>

        </div>

        {/* PAYMENT */}
        {order.paymentMethod && (
          <div className="payment-info">

            <strong>Payment Method</strong>

            <span>
              {order.paymentMethod}
            </span>

          </div>
        )}

        {/* FOOTER */}
        <div className="invoice-footer">

          <p>
            Thank you for shopping with Saajkar.
          </p>

          <p>
            Your jewellery order has been placed
            successfully.
          </p>

          <p className="invoice-note">
            We hope you enjoy your beautiful
            jewellery.
          </p>

        </div>

      </div>
    </div>
  );
};

export default Invoice;