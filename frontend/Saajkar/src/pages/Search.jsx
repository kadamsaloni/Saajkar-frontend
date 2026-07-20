import React, { useState } from "react";
import "./Search.css";


function Search() {


  const products = [

    {
      id:1,
      name:"Royal Gold Ring",
      price:5000,
      image:"/images/ring.jpg"
    },

    {
      id:2,
      name:"Diamond Necklace",
      price:25000,
      image:"/images/necklace.jpg"
    },

    {
      id:3,
      name:"Traditional Earrings",
      price:8000,
      image:"/images/earrings.jpg"
    },

    {
      id:4,
      name:"Gold Bracelet",
      price:12000,
      image:"/images/bracelet.jpg"
    }

  ];



  const [search, setSearch] = useState("");



  const filteredProducts = products.filter(product =>

    product.name
    .toLowerCase()
    .includes(search.toLowerCase())

  );



  return (

    <div className="search-page">


      <h1>
        Search Jewellery
      </h1>


      <div className="search-box">


        <input

          type="text"

          placeholder="Search rings, necklaces, earrings..."

          value={search}

          onChange={(e)=>setSearch(e.target.value)}

        />


      </div>



      <div className="search-products">


      {
        filteredProducts.map(product=>(


          <div className="search-card" key={product.id}>


            <img
              src={product.image}
              alt={product.name}
            />


            <h3>
              {product.name}
            </h3>


            <p>
              ₹{product.price}
            </p>


            <button>
              Add To Cart
            </button>


          </div>


        ))
      }


      </div>



    </div>

  );

}


export default Search;