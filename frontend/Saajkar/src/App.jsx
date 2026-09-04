import { Routes, Route } from "react-router-dom";


import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Checkout from "./pages/Checkout";
import Customization from "./pages/Customization";
import JewelleryCare from "./pages/JewelleryCare";
import Invoice from "./pages/Invoice";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";
import AdminLogin from "./pages/AdminLogin";
import MyOrders from "./pages/MyOrders";
import OrderTracking from "./pages/OrderTracking";
import Shop from "./pages/Shop";
import NewArrival from "./pages/NewArrival";
function App() {



    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<Search />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/collection/:category" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/jewellery-care" element={<JewelleryCare />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/customization" element={<Customization />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/my-orders" element={<MyOrders />} />
           <Route path="/collection" element={<Collection />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/track-order" element={<OrderTracking />} />
            <Route path="/new-arrival" element={<NewArrival />} />
        </Routes>
    );
}

export default App;