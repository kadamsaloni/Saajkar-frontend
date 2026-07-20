import React from "react";
import "./Filter.css";


const Filter = ({closeFilter}) => {


return (

<div className="filter-overlay">


<div className="filter-sidebar">


<div className="filter-header">

<h2>

</h2>


</div>

<div className="filter-header">

  <h2>Filter</h2>

  <button onClick={closeFilter}>
    ✕
  </button>

</div>



<hr/>



<h3>Price</h3>


<label>
<input type="checkbox"/>
Under ₹500
</label>


<label>
<input type="checkbox"/>
₹100 - ₹200
</label>


<label>
<input type="checkbox"/>
Above ₹20000
</label>




<h3>Category</h3>


<label>
<input type="checkbox"/>
Necklace
</label>


<label>
<input type="checkbox"/>
Earrings
</label>


<label>
<input type="checkbox"/>
Rings
</label>


<label>
<input type="checkbox"/>
Bridal Jewellery
</label>




<h3>Metal</h3>


<label>
<input type="checkbox"/>
Gold
</label>


<label>
<input type="checkbox"/>
Diamond
</label>


<label>
<input type="checkbox"/>
Silver
</label>




<h3>Occasion</h3>


<label>
<input type="checkbox"/>
Wedding
</label>


<label>
<input type="checkbox"/>
Party Wear
</label>


<label>
<input type="checkbox"/>
Daily Wear
</label>



<button className="apply-btn">
Apply Filter
</button>



</div>


</div>

);


};


export default Filter;