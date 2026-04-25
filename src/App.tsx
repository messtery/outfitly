import { BrowserRouter, Routes, Route } from "react-router-dom"
import TestPage from "./pages/TestPage"
import Register from "./pages/Register.jsx"
import Menu from "./pages/Menu.jsx"
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderTracking from './pages/OrderTrackingPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx';
import AdminProductManagement from "./pages/AdminProductManagement"
import AdminOrderManagement from "./pages/AdminOrderManagement"
import AdminOrderDetail from "./pages/AdminOrderDetail"
import AdminCategoryManagement from "./pages/AdminCategoryManagement"
import AdminDashboard from "./pages/AdminDashboard"
import AdminCustomerList from './pages/AdminCustomerList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test" element={<TestPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/ordertracking" element={<OrderTracking />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProductManagement />} />
        <Route path="/admin/orders" element={<AdminOrderManagement />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
        <Route path="/admin/categories" element={<AdminCategoryManagement />} />
        <Route path="/admin/customers" element={<AdminCustomerList />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
