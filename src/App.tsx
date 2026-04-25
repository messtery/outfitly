import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TestPage from './pages/TestPage';
import Register from './pages/Register.jsx';
import Menu from './pages/Menu.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderTrackingPage from './pages/OrderTrackingPage'

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/test" element={<TestPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/ordertracking" element={<OrderTrackingPage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;