import "./Wishlist.css";
import { Heart } from "lucide-react";

function Wishlist(){

const items=[
{
name:"Royal Gold Ring",
price:"₹499"
},
{
name:"Traditional Necklace",
price:"₹999"
},
{
name:"Luxury Earrings",
price:"₹559"
}
];

return(

<div className="wishlist">

<h1>
<Heart color="#D4AF37"/>
 My Wishlist
</h1>

<div className="wishlist-grid">

{items.map((item,index)=>(

<div className="wishlist-card" key={index}>

<div className="dummy-image">

💍

</div>

<h3>{item.name}</h3>

<p>{item.price}</p>

<button>Move To Cart</button>

</div>

))}

</div>

</div>

)

}

export default Wishlist;