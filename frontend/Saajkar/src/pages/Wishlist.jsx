import React, { useState } from "react";
import "./Wishlist.css";


function Wishlist() {


  const [wishlist, setWishlist] = useState([

    {
      id:1,
      name:"Royal Gold Ring",
      price:499,
      image:"/images/ring.jpg"
    },

    {
      id:2,
      name:"Traditional Necklace",
      price:999,
      image:"/images/necklace.jpg"
    },

    {
      id:3,
      name:"Traditional Earrings",
      price:559,
      image:"/images/earrings.jpg"
    },

    {
      id:4,
      name:"Bridal Set",
      price:9999,
      image:"/images/bridalset.jpg"
    },
    {
      id:5,
      name:"Nath",
      price:500,
      image:"/images/nath.jpg"
    }

    




  ]);



  const removeWishlist = (id)=>{

    setWishlist(

      wishlist.filter(item=>item.id !== id)

    );

  };



  return (

    <div className="wishlist-page">


      <h1>
        My Wishlist
      </h1>



      {
        wishlist.length === 0 ? (

          <h2 className="empty">
            Your wishlist is empty
          </h2>

        ) : (


        <div className="wishlist-grid">


        {
          wishlist.map(item=>(


            <div className="wishlist-card" key={item.id}>


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



              <button className="cart-btn">

                Add To Cart

              </button>



              <button

                className="remove-btn"

                onClick={()=>removeWishlist(item.id)}

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