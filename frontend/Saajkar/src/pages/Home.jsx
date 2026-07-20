import "./Home.css";

import Navbar from "../components/Navbar/Navbar";
import Banner from "../components/Banner/Banner";
import Filter from "../components/Filter/Filter";
import Categories from "../components/Categories/Categories";
import Products from "../components/Products/Products";


function Home(){

  return (

    <div className="home">

      <Navbar />

      <Banner />


      <div className="shop-layout">

        {/* Left Filter */}
        <Filter />


        {/* Right Side */}
        <div className="right-section">

          <Categories />

          <Products />

        </div>


      </div>


    </div>

  );

}

export default Home;