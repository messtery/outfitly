import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TestPage from './pages/TestPage';
import Register from './pages/Register.jsx';
import Browse from './pages/Browse.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test" element={<TestPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Browse />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;