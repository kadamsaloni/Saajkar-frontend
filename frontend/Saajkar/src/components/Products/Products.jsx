import "./Products.css";

import ring from "../../assets/ring.jpg";
import necklace from "../../assets/necklace.jpg";
import earring from "../../assets/Earring.jpg";
import bridalSet from "../../assets/bridalset.jpg";
import nath from "../../assets/nath.jpg";

const products = [
  {
    id: 1,
    name: "Royal Gold Ring",
    price: "₹499",
    image: ring,
  },
  {
    id: 2,
    name: "Traditional Necklace",
    price: "₹999",
    image: necklace,
  },
  {
    id: 3,
    name: "Luxury Earrings",
    price: "₹559",
    image: earring,
  },
  {
    id: 4,
    name: "Bridal Set",
    price: "₹9,999",
    image: bridalSet,
  },
  {
    id: 5,
    name: "Traditional Nath",
    price: "₹500",
    image: nath,
  },
];

function Products() {
  return (
    <div className="products">
      {products.map((product) => (
        <div className="card" key={product.id}>
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.price}</p>
          <button>Add To Cart</button>
        </div>
      ))}
    </div>
  );
}

export default Products;