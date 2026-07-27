import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import ring from "../assets/ring1.jpg";
import necklace from "../assets/necklace.jpg";
import earring from "../assets/Earring.jpg";

const Cart = () => {

  const navigate = useNavigate();


  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Royal Gold Ring",
      price: 500,
      image: ring
    },
    {
      id: 2,
      name: " Necklace",
      price: 1000,
      image: necklace
    },
    {
      id: 3,
      name: " Earrings",
      price: 550,
      image: earring
    }

  ]);
  useEffect(() => {
  localStorage.setItem(
    "cartItems",
    JSON.stringify(cartItems)
  );
}, [cartItems]);


  useEffect(() => {

    const items = JSON.parse(
      localStorage.getItem("cartItems")
    );


    if (items && items.length > 0) {
      setCartItems(items);
    }


  }, []);



  const removeItem = (index) => {

    const updatedCart = cartItems.filter(
      (_, i) => i !== index
    );


    setCartItems(updatedCart);


    localStorage.setItem(
      "cartItems",
      JSON.stringify(updatedCart)
    );

  };



  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );



  return (

    <div className="cart-page">


      <h1>Your Cart</h1>



      <div className="cart-container">


        {
          cartItems.map((item,index)=>(


            <div className="cart-card" key={index}>


              <img
                src={item.image}
                alt={item.name}
              />


              <div>

                <h2>
                  {item.name}
                </h2>


                <p>
                  Price: ₹{item.price}
                </p>


                <button
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>


              </div>


            </div>


          ))
        }


      </div>



      <div className="cart-total">


        <h2>
          Total: ₹{total}
        </h2>



        <button
          type="button"
          className="checkout-btn"
          onClick={() => navigate("/checkout")}
        >

          Proceed to Checkout

        </button>


      </div>



    </div>

  );

};


export default Cart;