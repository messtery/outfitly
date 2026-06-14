import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import Register from "./pages/Register.jsx"
import Menu from "./pages/Menu.jsx"
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderTracking from './pages/OrderTrackingPage.jsx'
import OrderHistory from './pages/OrderHistoryPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx';
import AdminProductManagement from "./pages/admin/ProductPage.js"
import AdminOrderManagement from "./pages/admin/OrderPage.js"
import AdminOrderDetail from "./pages/admin/OrderDetailPage.js"
import AdminCategoryManagement from "./pages/admin/CategoryPage.js"
import AdminDashboard from "./pages/admin/DashboardPage.js"
import AdminCustomerList from './pages/admin/CustomerPage.js';
import ProtectedLayout from "./middlewares/ProtectedLayout.jsx"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import AdminLayout from "./layouts/AdminLayout.js";
import AdminDashboardPage from "./pages/admin/DashboardPage.js";
import ProductPage from "./pages/admin/ProductPage.js";
import DashboardPage from "./pages/admin/DashboardPage.js";
import CategoryPage from "./pages/admin/CategoryPage.js";
import OrderDetailPage from "./pages/admin/OrderDetailPage.js";
import CustomerPage from "./pages/admin/CustomerPage.js";
import OrderPage from "./pages/admin/OrderPage.js";

function App() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedLayout />}>
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/ordertracking/:id" element={<OrderTracking />} />
              <Route path="/orderhistory" element={<OrderHistory />} />
            </Route>

            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/products" element={<ProductPage />} />
              <Route path="/admin/orders" element={<OrderPage />} />
              <Route path="/admin/orders/:id" element={<OrderDetailPage />} />
              <Route path="/admin/categories" element={<CategoryPage />} />
              <Route path="/admin/customers" element={<CustomerPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default App
