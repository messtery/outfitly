import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TestPage from './pages/TestPage';
import Register from './pages/Register.jsx';
import Menu from './pages/Menu.jsx';
import AdminProductManagement from './pages/AdminProductManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test" element={<TestPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/admin/products" element={<AdminProductManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
