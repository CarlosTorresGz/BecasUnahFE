import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Header  from './components/Header';
import Footer from './components/Footer'
import MainContent from './components/MainContent';

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <Header/>
        <MainContent/>
        <Footer/>
  </StrictMode>,
);

