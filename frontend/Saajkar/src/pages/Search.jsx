import React, { useState } from "react";
import "./Search.css";
import Fuse from "fuse.js";

function Search() {
  const products = [
    {
      id: 1,
      name: "Royal Ring",
      price: 500,
      image: "/images/ring.jpg",
    },
    {
      id: 2,
      name: " Necklace",
      price: 1000,
      image: "/images/necklace.jpg",
    },
    {
      id: 3,
      name: "Traditional Earrings",
      price: 550,
      image: "/images/earrings.jpg",
    },
    {
      id: 4,
      name: "Nath",
      price: 500,
      image: "/images/nath.jpg",
    },
  ];

  const [search, setSearch] = useState("");

  // Fuse.js configuration
  const fuse = new Fuse(products, {
    keys: ["name"],
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

    // If no exact match, use Fuse.js
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

      {suggestion && (
        <div className="suggestion">
          Did you mean <strong>{suggestion}</strong>?
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <h2 style={{ textAlign: "center", marginTop: "40px" }}>
          No products found.
        </h2>
      ) : (
        <div className="search-products">
          {filteredProducts.map((product) => (
            <div className="search-card" key={product.id}>
              <img src={product.image} alt={product.name} />

              <h3>{product.name}</h3>

              <p>₹{product.price}</p>

              <button>Add To Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;