import React, { useState } from "react";
import "./Search.css";
import Fuse from "fuse.js";
import { Link } from "react-router-dom";

function Search() {
  const products = [
    {
      id: 1,
      name: "Royal Ring",
      category: "ring",
      price: 500,
      image: "/images/ring.jpg",
    },
    {
      id: 2,
      name: "Necklace",
      category: "necklace",
      price: 1000,
      image: "/images/necklace.jpg",
    },
    {
      id: 3,
      name: "Traditional Earrings",
      category: "earrings",
      price: 550,
      image: "/images/earrings.jpg",
    },
    {
      id: 4,
      name: "Nath",
      category: "nath",
      price: 500,
      image: "/images/nath.jpg",
    },
  ];

  const [search, setSearch] = useState("");

  // Fuse.js configuration
  const fuse = new Fuse(products, {
    keys: ["name", "category"],
    threshold: 0.4,
  });

  let filteredProducts = products;
  let suggestion = null;

  if (search.trim() !== "") {
    // Exact word search
    filteredProducts = products.filter((product) =>
      product.name
        .toLowerCase()
        .split(" ")
        .includes(search.toLowerCase())
    );

    // Spelling suggestion
    if (filteredProducts.length === 0) {
      const results = fuse.search(search);

      if (results.length > 0) {
        suggestion = results[0].item.name;
        filteredProducts = results.map((result) => result.item);
      }
    }
  }

  return (
    <div className="search-page">

      <h1>Search Jewellery</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search rings, necklaces, earrings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Suggestion */}
      {suggestion && (
        <div className="suggestion">
          Did you mean <strong>{suggestion}</strong>?
        </div>
      )}

      {/* Products */}
      {filteredProducts.length === 0 ? (

        <h2
          style={{
            textAlign: "center",
            marginTop: "40px",
          }}
        >
          No products found.
        </h2>

      ) : (

        <div className="search-products">

          {filteredProducts.map((product) => (

            <div
              className="search-card"
              key={product.id}
            >

              <img
                
                
              />

              <h3>{product.name}</h3>

              
              {/* Explore Button */}
              <Link
                to={`/collection/${product.category}`}
                className="explore-btn"
              >
                Explore Now
              </Link>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Search;