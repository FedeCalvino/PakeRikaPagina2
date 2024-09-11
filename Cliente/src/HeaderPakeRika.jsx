import React, { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HeaderCss.css';
import { Link } from 'react-router-dom'; // Importa Link si estás usando react-router-dom
import { setPosition } from "./Features/PositionSlice";
import { useDispatch } from 'react-redux';

export const HeaderPakeRika = ({ setcarrito }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch();

  const GetLocaltion = () => {
    // Verificar si la geolocalización es soportada
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Actualizar el estado con la posición actual
          dispatch(setPosition([position.coords.latitude, position.coords.longitude]));
        },
        (error) => {
          console.error('Error obteniendo la ubicación:', error);
        }
      );
    } else {
      console.error('La geolocalización no es soportada por este navegador.');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header className={isScrolled ? 'transparent-header' : ''}>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <img src="./pakerikalogo-remove.png" alt="PakeRikas Logo" />
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/empanadas">Empanadas</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/pizzas">Pizzas</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/bebidas">Bebidas</Link>
                </li>
                <li className="nav-item">
                  <Link onClick={() => { GetLocaltion() }} className="nav-link" to="/CheckOut">Check Out</Link>
                </li>
              </ul>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <div className="nav-link" onClick={() => setcarrito()}>
                    <p className='carrito'>
                      <FaShoppingCart /> Carrito
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};
