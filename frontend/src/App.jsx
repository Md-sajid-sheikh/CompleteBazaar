import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Cart from './pages/Cart.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import CheckOut from './pages/CheckOut.jsx';
import Login from './pages/Login.jsx';
import About from './pages/About.jsx';
import Disclaimer from './pages/Desclaimer.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import Profile from './pages/Profile.jsx';
import Register from './pages/Register.jsx';
import ReturnPolicy from './pages/ReturnPolicy.jsx';
import { tw } from './tw.js';
import AdminLayout from './admin/AdminLayout.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import AdminOrders from './admin/AdminOrders.jsx';
import AdminProducts from './admin/AdminProducts.jsx';
import AdminUsers from './admin/AdminUsers.jsx';
import AddProduct from './admin/AddProduct.jsx';
import EditProduct from './admin/EditProduct.jsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className={tw('main-content bg-bazaar-paper font-sans text-bazaar-ink antialiased')}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AddProduct />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
