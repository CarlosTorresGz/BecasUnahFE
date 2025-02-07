import React, { useState, useEffect, useRef } from 'react';
import '../styles/MainContent.css';
import backgroundBlue from '../img/FONDOUNAH.jpg';
import backgroundRed from '../img/FONDOSEÑOR.jpg';
import backgroundGreen from '../img/VOAEBECAS.jpg';

const MainContent = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const sectionRef = useRef(null);

  const sections = [
    { className: 'section-blue', imageUrl: backgroundBlue, text: 'La Universidad Nacional Autónoma de Honduras (UNAH), a través del Programa de Atención Socioeconómica y Estímulos Educativos, ofrece la oportunidad de financiar tus estudios universitarios mediante una Beca o un Préstamo Educativo.' },
    { className: 'section-red', imageUrl: backgroundRed, text: 'La UNAH, a través de la VOAE, ofrece diversas becas según las necesidades de los estudiantes, ya sea por excelencia académica, situación económica, talento artístico o deportivo, permitiendo acceder a la que mejor se adapte a cada caso.' },
    { className: 'section-green', imageUrl: backgroundGreen},
  ];

  const nextSection = () => {
    setCurrentSection((currentSection + 1) % sections.length);
  };

  const prevSection = () => {
    setCurrentSection((currentSection - 1 + sections.length) % sections.length);
  };

  useEffect(() => {
    const adjustSectionHeight = () => {
      const image = new Image();
      image.src = sections[currentSection].imageUrl;
      image.onload = () => {
        const aspectRatio = image.height / image.width;
        const sectionWidth = sectionRef.current.offsetWidth;
        sectionRef.current.style.height = `${sectionWidth * aspectRatio}px`;
      };
    };

    adjustSectionHeight();
    window.addEventListener('resize', adjustSectionHeight);
    return () => window.removeEventListener('resize', adjustSectionHeight);
  }, [currentSection, sections]);

  return (
    <div className="main-content">
      <div ref={sectionRef} className={`section-container ${sections[currentSection].className}`} style={{ backgroundImage: `url(${sections[currentSection].imageUrl})` }}>
        <div className="section-content">
          {sections[currentSection].text}
        </div>
        <button className="nav-button prev-button" onClick={prevSection}>❮</button>
        <button className="nav-button next-button" onClick={nextSection}>❯</button>
      </div>
    </div>
  );
};

export default MainContent;
