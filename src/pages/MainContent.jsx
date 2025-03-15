import '../styles/MainContent.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import picture1 from '../img/FONDOUNAH.jpg';
import picture2 from '../img/FONDOSEÑOR.jpg';
import picture3 from '../img/VOAEBECAS.jpg';
import 'animate.css';
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const MainContent = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const sectionRef = useRef(null);


  const sections = [
    {
      className: 'section-picture1',
      imageUrl: picture1,
      text: 'La Universidad Nacional Autónoma de Honduras (UNAH), a través del Programa de Atención Socioeconómica y Estímulos Educativos, ofrece la oportunidad de financiar tus estudios universitarios mediante una Beca o un Préstamo Educativo.'
    },
    {
      className: 'section-picture2',
      imageUrl: picture2,
      text: 'La UNAH, a través de la VOAE, ofrece diversas becas según las necesidades de los estudiantes, ya sea por excelencia académica, situación económica, talento artístico o deportivo, permitiendo acceder a la que mejor se adapte a cada caso.'
    },
    {
      className: 'section-picture3',
      imageUrl: picture3,
      text: 'Explora nuestras oportunidades y encuentra el apoyo financiero que necesitas para tu educación.'
    },
  ];

  const nextSection = useCallback(() => {
    setCurrentSection((prev) => (prev + 1) % sections.length);
  }, [sections.length]);

  const prevSection = useCallback(() => {
    setCurrentSection((prev) => (prev - 1 + sections.length) % sections.length);
  }, [sections.length]);

  // Pre-cargar la siguiente imagen para mejorar la transición
  useEffect(() => {
    const nextIndex = (currentSection + 1) % sections.length;
    const img = new Image();
    img.src = sections[nextIndex].imageUrl;
  }, [currentSection, sections]);
  
  return (
    <div className="main-content">
      <div
        ref={sectionRef}
        className={`section-container ${sections[currentSection].className}`}
        style={{
          backgroundImage: `url(${sections[currentSection].imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="section-content">
          {sections[currentSection].text}
        </div>
        <button className="nav-button prev-button" onClick={prevSection}>
          <MdNavigateBefore />

        </button>
        <button className="nav-button next-button" onClick={nextSection}>
          <MdNavigateNext />
        </button>
      </div>
    </div>
  );
};

export default MainContent;
