import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TestPage from './pages/TestPage';
import Register from './pages/Register.jsx';
import Menu from './pages/Menu.jsx';
import AdminProductManagement from './pages/AdminProductManagement';
import AdminOrderManagement from './pages/AdminOrderManagement';
import AdminOrderDetail from './pages/AdminOrderDetail';
import AdminCategoryManagement from './pages/AdminCategoryManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test" element={<TestPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/admin/products" element={<AdminProductManagement />} />
        <Route path="/admin/orders" element={<AdminOrderManagement />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
        <Route path="/admin/categories" element={<AdminCategoryManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
