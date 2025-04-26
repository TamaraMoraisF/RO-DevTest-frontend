import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import SuccessPage from './pages/SuccessPage';
import { CreateUserPage } from './pages/CreateUserPage';

function App() {
  const token = localStorage.getItem('accessToken');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/create-user" element={<CreateUserPage />} />
        <Route
          path="*"
          element={<Navigate to={token ? '/success' : '/login'} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;