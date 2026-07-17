import "./Cart.css";

function Cart() {

  const cartItems = [
    {
      id: 1,
      name: "Royal Gold Ring",
      price: "₹499",
    },
    {
      id: 2,
      name: "Traditional Necklace",
      price: "₹999",
    },
  ];

  return (
    <div className="cart-page">

      <h1>🛒 Shopping Cart</h1>

      <div className="cart-container">

        {cartItems.map((item) => (
          <div className="cart-card" key={item.id}>

            <div className="cart-image">
              💍
            </div>

            <div className="cart-details">
              <h3>{item.name}</h3>
              <p>{item.price}</p>
            </div>

            <button className="remove-btn">
              Remove
            </button>

          </div>
        ))}

      </div>

      <div className="cart-total">

        <h2>Total : ₹1498</h2>

        <button className="checkout-btn">
          Proceed to Checkout
        </button>

      </div>

    </div>
  );
}

export default Cart;