import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import Register from "./pages/Register.jsx"
import Menu from "./pages/Menu.jsx"
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderTracking from './pages/OrderTrackingPage.jsx'
import OrderHistory from './pages/OrderHistoryPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx';
import AccountSettingsPage from './pages/AccountSettingsPage';
import ProtectedLayout from "./middlewares/ProtectedLayout.jsx"
import AdminProtectedLayout from "./middlewares/AdminProtectedLayout";
import { TooltipProvider } from "@/components/ui/tooltip"
import AdminLayout from "./layouts/AdminLayout.js";
import CustomerLayout from "./layouts/CustomerLayout.jsx";
import ProductPage from "./pages/admin/ProductPage.js";
import DashboardPage from "./pages/admin/DashboardPage.js";
import CategoryPage from "./pages/admin/CategoryPage.js";
import OrderDetailPage from "./pages/admin/OrderDetailPage.js";
import CustomerPage from "./pages/admin/CustomerPage.js";
import OrderPage from "./pages/admin/OrderPage.js";
import RolePage from "./pages/admin/RolePage.js";
import UserPage from "./pages/admin/UserPage.js";
import AccountPage from "./pages/admin/AccountPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import { AdminAuthProvider } from "./context/AdminAuthContext";

function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedLayout />}>
            <Route element={<CustomerLayout />}>
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/ordertracking/:id" element={<OrderTracking />} />
              <Route path="/orderhistory" element={<OrderHistory />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/account" element={<AccountSettingsPage />} />
            </Route>
          </Route>

          <Route path="/admin" element={<AdminAuthProvider><Navigate to="/admin/login" replace /></AdminAuthProvider>} />
          <Route path="/admin/login" element={<AdminAuthProvider><AdminLoginPage /></AdminAuthProvider>} />
          <Route element={<AdminAuthProvider><AdminProtectedLayout /></AdminAuthProvider>}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/products" element={<ProductPage />} />
              <Route path="/admin/orders" element={<OrderPage />} />
              <Route path="/admin/orders/:id" element={<OrderDetailPage />} />
              <Route path="/admin/categories" element={<CategoryPage />} />
              <Route path="/admin/customers" element={<CustomerPage />} />
              <Route path="/admin/roles" element={<RolePage />} />
              <Route path="/admin/users" element={<UserPage />} />
              <Route path="/admin/account" element={<AccountPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  )
}

export default App
