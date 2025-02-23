import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from './components/layout/MainLayout';
import MainContent from './components/MainContent';
import { LoginApp } from './components/LoginApp';
import ChangePassword from './components/ChangePassword';  // Importa el nuevo componente
import FAQComponent from './components/FrequentlyAskedQuestions';
<<<<<<< HEAD
import { Toaster, toast } from 'sonner'
=======
import Dashboard from './components/Dashboard';
>>>>>>> feature/dashboard-activities

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster richColors />
    <Router>
      <Routes>
        {/* Rutas con Navbar y Footer */}
        <Route path="/" element={<MainLayout />} >
          <Route index element={<MainContent />} />
          <Route path="/login" element={<LoginApp />} />
          <Route path="/login/employee" element={<LoginApp number="No. Empleado" />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/FAQ" element={<FAQComponent />} />
        </Route>

        {/* Rutas sin Navbar ni Footer */}
        <Route path="dashboard/administrador" element={<Dashboard userType={'admin'} />} />
        <Route path="dashboard/becario" element={<Dashboard userType={'becario'} />} />
      </Routes>
    </Router>
  </StrictMode >
);
