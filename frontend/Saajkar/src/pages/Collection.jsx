import React from "react";
import {useParams} from "react-router-dom";
import shopData from "../data/shopData";
import Product from "../components/Product/Product";


const Collection = () => {

const {category}=useParams();


return(
   <div>
      {category}
   </div>
)

}


export default Collection;