import React, { useState } from "react";
import "./Cart.css";


function Cart() {


  const [cartItems, setCartItems] = useState([

    {
      id: 1,
      name: "Royal Gold Ring",
      price: 499,
      quantity: 1,
      image: "/images/ring.jpg"
    },

    {
      id: 2,
      name: "Traditional Earrings",
      price: 559,
      quantity: 1,
      image: "/images/earrings.jpg"
    }

  ]);



  const increaseQty = (id) => {

    setCartItems(

      cartItems.map(item =>

        item.id === id

        ? {
            ...item,
            quantity: item.quantity + 1
          }

        : item

      )

    );

  };



  const decreaseQty = (id) => {

    setCartItems(

      cartItems.map(item =>

        item.id === id && item.quantity > 1

        ? {
            ...item,
            quantity: item.quantity - 1
          }

        : item

      )

    );

  };



  const removeItem = (id) => {

    setCartItems(

      cartItems.filter(item => item.id !== id)

    );

  };



  const total = cartItems.reduce(

    (sum, item) =>

      sum + item.price * item.quantity,

    0

  );



  return (

    <div className="cart-page">


      <h1>Your Shopping Cart</h1>



      <div className="cart-container">



        <div className="cart-items">


          {cartItems.length === 0 ? (

            <h2>Your cart is empty</h2>

          ) : (


            cartItems.map(item => (


              <div className="cart-card" key={item.id}>


                <img 
                  src={item.image} 
                  alt={item.name}
                />



                <div className="cart-details">


                  <h3>{item.name}</h3>


                  <p>
                    ₹{item.price}
                  </p>



                  <div className="quantity">


                    <button onClick={() => decreaseQty(item.id)}>
                      -
                    </button>


                    <span>
                      {item.quantity}
                    </span>


                    <button onClick={() => increaseQty(item.id)}>
                      +
                    </button>


                  </div>



                  <button

                    className="remove"

                    onClick={() => removeItem(item.id)}

                  >

                    Remove

                  </button>



                </div>


              </div>


            ))

          )}



        </div>




        <div className="cart-summary">


          <h2>
            Order Summary
          </h2>



          <div className="total">

            Total:

            <span>
              ₹{total}
            </span>

          </div>



          <button className="checkout">

            Proceed To Checkout

          </button>


        </div>



      </div>


    </div>

  );

}


export default Cart;