import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Providers from './components/Providers';
import AuthGuard from './components/AuthGuard';
import Home from './pages/Home';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Providers>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <AuthGuard>
                <Home />
              </AuthGuard>
            }
          />
        </Routes>
      </Providers>
    </BrowserRouter>
  );
}
