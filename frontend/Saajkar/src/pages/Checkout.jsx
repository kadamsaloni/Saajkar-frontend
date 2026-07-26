import React, { useEffect, useState } from "react";
import "./Checkout.css";

const Checkout = () => {

  const [cartItems, setCartItems] = useState([]);


  useEffect(() => {

    const items = JSON.parse(
      localStorage.getItem("cartItems")
    );

    if(items && items.length > 0){
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


        <div className="checkout-form">

          <h2>Billing Details</h2>

          <input placeholder="Full Name" />

          <input placeholder="Email Address" />

          <input placeholder="Phone Number" />

          <textarea placeholder="Address"></textarea>

        </div>



        <div className="order-summary">

          <h2>Order Summary</h2>


          {
            cartItems.map((item,index)=>(

              <div className="order-item" key={index}>

                <img
                  src={item.image}
                  alt={item.name}
                />


                <div>

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    Price: ₹{item.price}
                  </p>

                </div>


              </div>

            ))
          }


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