import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Wishlist.css";

function Wishlist() {

    const navigate = useNavigate();

    const [wishlist, setWishlist] = useState([
        {
            id: 1,
            name: "Royal Gold Ring",
            price: 499,
            image: "/images/ring.jpg"
        },
        {
            id: 2,
            name: "Traditional Necklace",
            price: 999,
            image: "/images/necklace.jpg"
        },
        {
            id: 3,
            name: "Traditional Earrings",
            price: 559,
            image: "/images/earrings.jpg"
        },
        {
            id: 4,
            name: "Bridal Set",
            price: 9999,
            image: "/images/bridalset.jpg"
        },
        {
            id: 5,
            name: "Nath",
            price: 500,
            image: "/images/nath.jpg"
        }
    ]);

    // Remove item from wishlist
    const removeWishlist = (id) => {

        const updatedWishlist = wishlist.filter(
            item => item.id !== id
        );

        setWishlist(updatedWishlist);
    };


    // Add wishlist item to cart
    const addToCart = (item) => {

        // Get existing cart
        const existingCart =
            JSON.parse(localStorage.getItem("cartItems")) || [];


        // Check if product already exists
        const alreadyInCart = existingCart.some(
            cartItem => cartItem.id === item.id
        );


        if (alreadyInCart) {

            alert("This product is already in your cart.");

            navigate("/cart");

            return;
        }


        // Add product to cart
        const updatedCart = [
            ...existingCart,
            {
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image
            }
        ];


        // Save cart
        localStorage.setItem(
            "cartItems",
            JSON.stringify(updatedCart)
        );


        alert(`${item.name} added to cart!`);


        // Open cart
        navigate("/cart");
    };


    return (

        <div className="wishlist-page">

            <h1>
                My Wishlist
            </h1>


            {
                wishlist.length === 0 ? (

                    <h2 className="empty-wishlist">
                        Your wishlist is empty
                    </h2>

                ) : (

                    <div className="wishlist-grid">

                        {
                            wishlist.map(item => (

                                <div
                                    className="wishlist-card"
                                    key={item.id}
                                >

                                    <img
                                        src={item.image}
                                        alt={item.name}
                                    />


                                    <h3>
                                        {item.name}
                                    </h3>


                                    <p>
                                        ₹{item.price}
                                    </p>


                                    <button
                                        className="cart-btn"
                                        onClick={() =>
                                            addToCart(item)
                                        }
                                    >
                                        Add To Cart
                                    </button>


                                    <button
                                        className="remove-btn"
                                        onClick={() =>
                                            removeWishlist(item.id)
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            ))
                        }

                    </div>

                )
            }

        </div>
    );
}

export default Wishlist;