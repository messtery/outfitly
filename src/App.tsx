import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TestPage from './pages/TestPage';
import Register from './pages/Register.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test" element={<TestPage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;