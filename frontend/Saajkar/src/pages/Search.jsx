import "./Search.css";
import { Search } from "lucide-react";
import { useState } from "react";

function SearchPage() {
  const [search, setSearch] = useState("");

  const products = [
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
    {
      id: 3,
      name: "Luxury Earrings",
      price: "₹559",
    },
    {
      id: 4,
      name: "Bridal Set",
      price: "₹9,999",
    },
    {
      id: 5,
      name: "Traditional Nath",
      price: "₹500",
    },
    {
      id: 6,
      name: "Gold Bangles",
      price: "₹1,299",
    },
    {
      id: 7,
      name: "Mangalsutra",
      price: "₹2,499",
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="search-page">

      <h1>Search Jewellery</h1>

      <div className="search-box">

        <Search className="search-icon" />

        <input
          type="text"
          placeholder="Search jewellery..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="search-results">

        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="search-card" key={product.id}>

              <div className="dummy-image">
                💍
              </div>

              <h3>{product.name}</h3>

              <p>{product.price}</p>

              <button>Add To Cart</button>

            </div>
          ))
        ) : (
          <h2>No Jewellery Found</h2>
        )}

      </div>

    </div>
  );
}

export default SearchPage;