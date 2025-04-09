import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from './components/layout/MainLayout';
import { Toaster } from 'sonner';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
// Páginas públicas
import MainContent from './pages/MainContent';
import { LoginApp } from './pages/LoginApp';
import ChangePassword from './pages/ChangePassword';
import FAQComponent from './pages/FrequentlyAskedQuestions';
import Planillas from './pages/Planillas';
import TipoBecas from './pages/TipoBecas';
import Comunicados from './pages/Comunicados';
//Admin
import AdminActividades from './pages/AdminActividades';
import AgregarActividad from './pages/AgregarActividad';
import ListadoAsistencia from './pages/ListadoAsistencia';
import { Report } from './pages/Report';
import SeguimientoBeca from './pages/SeguimientoBeca';
//Becario
import ActividadesDisponibles from './pages/ActividadesDisponibles';
import ActividadesInscritas from './pages/ActividadesInscritas';
import ActividadesRealizadas from './pages/ActividadesRealizadas';
import { MiBeca } from './pages/MiBeca';
import { ProfileBecario } from './pages/ProfileBecario';
import { DashboardProvider } from './context/DashboardContext';



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
            <Route path="/login" element={<LoginApp userType={'becario'} />} />
            <Route path="/login/employee" element={<LoginApp userType={'admin'} />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/FAQ" element={<Planillas />} />
            <Route path="/tipo-becas" element={<TipoBecas />} />
          </Route>

          {/* Rutas protegidas para becario */}
          <Route path="dashboard/becario" element={
            <DashboardProvider userType='becario'>
              <Dashboard userType='becario' />
            </DashboardProvider>
          }>
            <Route index element={<ActividadesDisponibles />} />
            <Route path="actividades-disponibles" element={<ActividadesDisponibles />} />
            <Route path="actividades-inscritas" element={<ActividadesInscritas />} />
            <Route path="actividades-realizadas" element={<ActividadesRealizadas />} />
            <Route path='mi-beca' element={<MiBeca />} />
            <Route path='mi-perfil' element={<ProfileBecario />} />
            <Route path="reportes/recibidos" element={<Report />} />
          </Route>
          {/* Rutas protegidaspara administradores */}
          <Route path="dashboard/administrador" element={
            <DashboardProvider userType={'admin'}>
              <Dashboard userType='admin' />
            </DashboardProvider>
          }>
            <Route index element={<AdminActividades />} />
            <Route path="actividades" element={<AdminActividades />} />
            <Route path="nueva-actividad" element={<AgregarActividad />} />
            <Route path='lista-asistencia' element={<ListadoAsistencia />} />
            <Route path='seguimiento-beca' element={<SeguimientoBeca />} />
            {/*<Route path='planilla' element={<Planilla />} />*/}
            <Route path='faq' element={<FAQComponent />} />
            <Route path="reportes/enviados" element={<Report />} />
          </Route>
          
        </Routes>
      </Router>
    </AuthProvider >
  </StrictMode >
);