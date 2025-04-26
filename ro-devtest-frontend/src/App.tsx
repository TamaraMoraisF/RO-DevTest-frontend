import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import SuccessPage from './pages/SuccessPage'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/success" element={<SuccessPage />} /> {/* ✅ */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;