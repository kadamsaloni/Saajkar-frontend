import React from "react";
import { Link } from "react-router-dom";
import "./Categories.css";

import ring from "../../assets/nath.jpg";
import necklace from "../../assets/necklace.jpg";
import earring from "../../assets/Earring.jpg";
import bridal from "../../assets/bridalset.jpg";
import nath from "../../assets/nath.jpg";
import hairpin from "../../assets/hairpin.jpg";
import ring1 from "../../assets/ring1.jpg";


const categories = [
  
  {
    name: "Ring1",
    image: ring1,
  },
  {
    name: "Necklaces",
    image: necklace,
  },
  {
    name: "Earrings",
    image: earring,
  },
  {
    name: "Bridal",
    image: bridal,
  },
  {
    name: "Nath",
    image: nath,
  },
  {
    name: "Hairpin",
    image: hairpin,
  },
];


function Categories() {
  return (
    <section className="categories-section">

      <h2 className="category-title">
        Explore Our Categories
      </h2>


      <div className="categories">

        {categories.map((item) => (

          <div className="category" key={item.name}>

            <img
              src={item.image}
              alt={item.name}
              className="category-img"
            />

            <h2>{item.name}</h2>


            <Link to={`/collection/${item.name}`}>
              <button>
                Explore Now
              </button>
            </Link>


          </div>

        ))}

      </div>

    </section>
  );
}


export default Categories;