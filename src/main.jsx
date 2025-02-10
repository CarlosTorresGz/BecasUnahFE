import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MainContent from './components/MainContent';
import { LoginApp } from './components/LoginApp';
import ChangePassword from './components/ChangePassword';  // Importa el nuevo componente
import FAQComponent from './components/FrequentlyAskedQuestions';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/login" element={<LoginApp />} /> 
        <Route path="/login/employee" element={<LoginApp number="No. Empleado" />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/FAQ" element={<FAQComponent />} />
      </Routes>
      <Footer />
    </Router>
  </StrictMode>,
);
