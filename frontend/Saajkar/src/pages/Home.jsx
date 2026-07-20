import "./Home.css";

import Navbar from "../components/Navbar/Navbar";

import Banner from "../components/Banner/Banner";
import Categories from "../components/Categories/Categories";
import Products from "../components/Product/Product";

function Home() {
  return (
    <div className="home">
      <Navbar />
      
      <Banner />

      <Categories />

      <Products />
    </div>
  );
}

export default Home;