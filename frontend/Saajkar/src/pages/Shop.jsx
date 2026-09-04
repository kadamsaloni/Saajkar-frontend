import React, { useEffect, useState } from "react";
import "./Shop.css";

const Shop = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // Backend API
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading products:", error);
        setLoading(false);
      });

  }, []);


  // Group products according to category
  const groupedProducts = products.reduce((groups, product) => {

    const category = product.category || "Other";

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(product);

    return groups;

  }, {});


  if (loading) {
    return (
      <div className="shop-loading">
        Loading products...
      </div>
    );
  }


  return (
    <div className="shop-page">

      {/* HEADER */}

      <section className="shop-header">

        <p className="shop-small-title">
          SAAJKAR COLLECTION
        </p>

        <h1></h1>

        <p className="shop-description">
          
        </p>

      </section>


      {/* CATEGORIES */}

      <section className="shop-content">

        {Object.keys(groupedProducts).map((category) => (

          <div
            className="shop-category-section"
            key={category}
          >

            {/* CATEGORY TITLE */}

            <div className="category-title">

              <h2>
                {category}
              </h2>

              <div className="category-line"></div>

            </div>


            {/* PRODUCTS */}

            <div className="shop-grid">

              {groupedProducts[category].map((product) => (

                <div
                  className="shop-card"
                  key={product.id}
                >

                  {/* IMAGE */}

                  <div className="shop-image">

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    <button className="wishlist-button">
                      ♡
                    </button>

                  </div>


                  {/* PRODUCT DETAILS */}

                  <div className="shop-info">

                    <p className="product-category">
                      {product.category}
                    </p>

                    <h3>
                      {product.name}
                    </h3>

                    <p className="shop-price">
                      ₹{product.price}
                    </p>

                    <button className="add-cart-button">
                      ADD TO CART
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>

        ))}

      </section>

    </div>
  );
};

export default Shop;