import React from "react";
import { useParams } from "react-router-dom";

function Collection() {

  const { category } = useParams();

  return (
    <div>
      <h1>
        Collection Page Working
      </h1>

      <h2>
        Category: {category}
      </h2>
    </div>
  );
}

export default Collection;