import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {

    const navigate = useNavigate();


    // Load cart from localStorage
    const [cartItems, setCartItems] = useState(() => {

        const savedCart =
            localStorage.getItem("cartItems");

        return savedCart
            ? JSON.parse(savedCart)
            : [];
    });


    // Save cart whenever cart changes
    useEffect(() => {

        localStorage.setItem(
            "cartItems",
            JSON.stringify(cartItems)
        );

    }, [cartItems]);


    // Remove item from cart
    const removeItem = (id) => {

        const updatedCart = cartItems.filter(
            item => item.id !== id
        );

        setCartItems(updatedCart);
    };


    // Calculate total
    const total = cartItems.reduce(
        (sum, item) =>
            sum + Number(item.price),
        0
    );


    return (

        <div className="cart-page">

            <h1>
                Your Cart
            </h1>


            {
                cartItems.length === 0 ? (

                    <div className="empty">

                        <h2>
                            Your cart is empty
                        </h2>

                        <button
                            onClick={() => navigate("/")}
                        >
                            Continue Shopping
                        </button>

                    </div>

                ) : (

                    <>

                        <div className="cart-container">

                            {
                                cartItems.map(item => (

                                    <div
                                        className="cart-card"
                                        key={item.id}
                                    >

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
                                                onClick={() =>
                                                    removeItem(item.id)
                                                }
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
                                onClick={() =>
                                    navigate("/checkout")
                                }
                            >
                                Proceed to Checkout
                            </button>

                        </div>

                    </>
                )
            }

        </div>
    );
};

export default Cart;