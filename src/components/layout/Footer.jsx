import { useNavigate } from 'react-router-dom';
import '../../styles/Footer.css';
import VOAE from '../../img/VOAE2.jpg';
import UNAH from '../../img/unah2.svg';
import FACEBOOK from '../../img/facebook.svg';
import YOUTUBE from '../../img/youtube.svg';
import IG from '../../img/ig.svg';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-top">
          <img src={VOAE} alt="VOAE Logo" className="footer-logo" />
          <div className="center-text">
            <p><strong>Universidad Nacional Autónoma de Honduras | UNAH</strong></p>
            <p><strong>Derechos reservados 2024</strong></p>
          </div>
          <img src={UNAH} alt="UNAH Logo" className="footer-logo" />
        </div>
        <div className="footer-bottom">
          <div className="footer-column">
            <p><strong>¿Dudas?</strong></p>
            <span className="highlight" onClick={() => { navigate('/FAQ') }}><strong>Preguntas Frecuentes</strong></span>
          </div>
          <div className="footer-column">
            <p><strong>¿Problemas?</strong></p>
            <span className="highlight"><strong>Soporte UNAH</strong></span>
          </div>
          <div className="footer-column">
            <p><strong>Encuéntranos en:</strong></p>
            <div className="social-icons">
              <a href="https://www.facebook.com/VOAEUNAH" target="_blank">
                <img src={FACEBOOK} alt="Facebook" className="social-icon" />
              </a>
              <a href="" target="_blank">
                <img src={YOUTUBE} alt="YouTube" className="social-icon" />
              </a>
              <a href="https://www.instagram.com/voaeunah/" target="_blank">
                <img src={IG} alt="Instagram" className="social-icon" />
              </a>
            </div>
          </div>
          <div className="footer-column">
            <button className="contact-button"><strong>CONTÁCTENOS</strong></button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
