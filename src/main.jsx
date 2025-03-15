import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from './components/layout/MainLayout';
import MainContent from './pages/MainContent';
import { LoginApp } from './pages/LoginApp';
import ChangePassword from './pages/ChangePassword';
import FAQComponent from './pages/FrequentlyAskedQuestions';
import { Toaster } from 'sonner';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import TipoBecas from './pages/TipoBecas';
import AgregarActividad from './pages/AgregarActividad';
import Comunicados from './pages/Comunicados';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Toaster richColors />
      <Router>
        <Routes>
          {/* Rutas con Navbar y Footer */}
          <Route path="/" element={<MainLayout />} >
            <Route index element={<MainContent />} />
            <Route path="/comunicados" element={<Comunicados />} /> {/* Nueva ruta */}
            <Route path="/login" element={<LoginApp />} />
            <Route path="/login/employee" element={<LoginApp number="No. Empleado" />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/FAQ" element={<FAQComponent />} />
            <Route path="/tipo-becas" element={<TipoBecas />} />
          </Route>

          {/* Rutas sin Navbar ni Footer */}
          <Route path="dashboard/administrador" element={<Dashboard userType={'admin'} />} />
          <Route path="dashboard/becario" element={<Dashboard userType={'becario'} />} />
          <Route path="dashboard/administrador/nueva-actividad" element={<AgregarActividad />} /> {/* Nueva ruta */}
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);