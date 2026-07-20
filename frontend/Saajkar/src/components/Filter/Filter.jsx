import "./Filter.css";

function Filter() {
  return (
    <aside className="filter">

      <h2>Filter By</h2>

      {/* Price */}
      <div className="filter-section">

        <h3>Price</h3>

        <label>
          <input type="checkbox" />
          Under ₹1,000
        </label>

        <label>
          <input type="checkbox" />
          ₹1,000 - ₹5,000
        </label>

        <label>
          <input type="checkbox" />
          Above ₹5,000
        </label>

      </div>

      {/* Category */}

      <div className="filter-section">

        <h3>Category</h3>

        <label><input type="checkbox" /> Rings</label>

        <label><input type="checkbox" /> Necklaces</label>

        <label><input type="checkbox" /> Earrings</label>

        <label><input type="checkbox" /> Bridal Sets</label>

        <label><input type="checkbox" /> Bangles</label>

        <label><input type="checkbox" /> Mangalsutra</label>

        <label><input type="checkbox" /> Nath</label>

        <label><input type="checkbox" /> Anklets</label>

      </div>

      {/* Material */}

      <div className="filter-section">

        <h3>Material</h3>

        <label><input type="checkbox" /> Gold</label>

        <label><input type="checkbox" /> Silver</label>

        <label><input type="checkbox" /> Diamond</label>

        <label><input type="checkbox" /> Kundan</label>

      </div>

      {/* Occasion */}

      <div className="filter-section">

        <h3>Occasion</h3>

        <label><input type="checkbox" /> Wedding</label>

        <label><input type="checkbox" /> Festival</label>

        

      </div>

      <button className="apply-btn">
        Apply Filters
      </button>

    </aside>
  );
}

export default Filter;