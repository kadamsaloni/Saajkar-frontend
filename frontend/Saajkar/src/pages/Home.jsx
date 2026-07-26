import "./Home.css";

import Navbar from "../components/Navbar/Navbar";

import Banner from "../components/Banner/Banner";
import Categories from "../components/Categories/Categories";
import Product from "../components/Product/Product";
import Footer from "../components/Footer/Footer";
function Home() {
  return (
    <div className="home">
      <Navbar />
      
      <Banner />

      <Categories />

      <Product />

      <Footer />
    </div>
  );
}

export default Home;