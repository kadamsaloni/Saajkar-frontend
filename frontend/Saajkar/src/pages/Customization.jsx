import "./Customization.css";


function Customization(){

return(

<div className="custom-page">


{/* HERO SECTION */}

<section className="custom-banner">

<div className="banner-content">

<h1>
Create Your Dream Jewellery
</h1>

<p>
Whether you have a sketch, a photo, or just an idea, our expert artisans 
will transform it into a timeless masterpiece.
</p>


<button>
Start Your Design
</button>

</div>

</section>




{/* INTRO */}

<section className="custom-intro">


<h2>
Jewellery Designed Around Your Vision
</h2>


<p>
At Saajkar, we believe every jewellery piece should be as unique as the
person wearing it. Share your inspiration, tell us your ideas, and we'll
create a handcrafted design made exclusively for you.
</p>


</section>





{/* HOW IT WORKS */}


<section className="how-section">


<h2>
How It Works
</h2>



<div className="steps">


<div className="step-card">

<span>
1
</span>

<h3>
Share Your Idea
</h3>

<p>
Tell us what you want to create.
</p>

</div>



<div className="step-card">

<span>
2
</span>

<h3>
Upload Inspiration
</h3>

<p>
Add photos, sketches or references.
</p>

</div>





<div className="step-card">

<span>
3
</span>

<h3>
Consultation
</h3>

<p>
Our jewellery experts discuss every detail.
</p>

</div>





<div className="step-card">

<span>
4
</span>

<h3>
Crafting
</h3>

<p>
Your jewellery is handcrafted with precision.
</p>

</div>




<div className="step-card">

<span>
5
</span>

<h3>
Delivery
</h3>

<p>
Receive your dream jewellery safely.
</p>

</div>



</div>


</section>





{/* CUSTOM FORM */}



<section className="custom-container">


<h2>
Customization Request
</h2>



<div className="custom-form">



<div className="custom-box">

<label>
Full Name
</label>

<input 
type="text"
placeholder="Enter your name"
/>

</div>




<div className="custom-box">

<label>
Email
</label>

<input 
type="email"
placeholder="Enter your email"
/>

</div>





<div className="custom-box">

<label>
Phone Number
</label>

<input 
type="text"
placeholder="Enter phone number"
/>

</div>





<div className="custom-box">

<label>
Jewellery Type
</label>


<select>

<option>
Select Jewellery
</option>

<option>
Ring
</option>

<option>
Necklace
</option>

<option>
Earrings
</option>

<option>
Bangle
</option>

<option>
Bracelet
</option>

<option>
Bridal Set
</option>


</select>

</div>





<div className="custom-box">


<label>
Material
</label>


<select>

<option>
Select Material
</option>

<option>
Gold
</option>

<option>
Diamond
</option>

<option>
Silver
</option>

<option>
Platinum
</option>


</select>


</div>





<div className="custom-box">


<label>
Describe Your Design
</label>


<textarea

placeholder="Explain your jewellery design idea..."

></textarea>


</div>





<div className="custom-box">


<label>
Upload Reference Image
</label>


<input 
type="file"
/>


</div>





<div className="custom-box">


<label>
Budget Range
</label>


<select>


<option>
Select Budget
</option>


<option>
Below ₹25,000
</option>


<option>
₹25,000 - ₹50,000
</option>


<option>
₹50,000 - ₹1,00,000
</option>


<option>
Above ₹1,00,000
</option>


</select>


</div>




<button className="submit-btn">

Submit Custom Request

</button>




</div>


</section>


</div>

)

}


export default Customization;