import Navbar from "../components/Navbar/Navbar";
import Banner from "../components/Banner/Banner";
import Categories from "../components/Categories/Categories";
import Filter from "../components/Filter/Filter";
import Products from "../components/Products/Products";

function Home() {
  return (
    <>
      <Navbar />
      <Banner />
      <Categories />
      <Filter />
      <Products />
    </>
  );
}

export default Home;