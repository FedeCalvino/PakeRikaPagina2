import React, { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HeaderCss.css';
import { Link } from 'react-router-dom';
import { setPosition } from "./Features/PositionSlice";
import { useDispatch, useSelector } from 'react-redux';
import { setCarritoSlice } from './Features/CarritoSlice';
import { useNavigate } from 'react-router-dom';

export const HeaderPakeRika = ({ setcarrito }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductAdded, setIsProductAdded] = useState(false);
  const dispatch = useDispatch();
  
  const carrito = useSelector((state) => state.Carrito);

  useEffect(() => {
    const carritoLocalStorage = localStorage.getItem('carrito');
    if (carritoLocalStorage) {
      const carritoObjeto = JSON.parse(carritoLocalStorage);
      if (!carrito.prods || carrito.prods.length === 0) {
        dispatch(setCarritoSlice(carritoObjeto));
      }
    }

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
  }, [dispatch, carrito.prods]);

  const GetLocaltion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
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

  const handleAddToCart = () => {
    setcarrito();
    setIsProductAdded(true);
    setTimeout(() => setIsProductAdded(false), 2000);
  };

  const goToCheckOut = () => {
    GetLocaltion();
    navigate("/CheckOut");
  };

  return (
    <>
      <header className={isScrolled ? 'transparent-header' : ''}>
        <nav className="navbar navbar-light bg-light">
          <div className="container d-flex justify-content-between align-items-center">
            <img src="./pakerikalogo-remove.png" alt="PakeRikas Logo" />
            <ul className="navbar-nav d-flex flex-row">
              <li className="nav-item mx-3">
                <Link className="nav-link large-link" to="/">Catálogo</Link>
              </li>
              <li className="nav-item mx-3">
                <Link className="nav-link large-link" to="/OrdenesP">Órdenes</Link>
              </li>
              <li className="nav-item mx-3">
                <Link className="nav-link large-link" to="/StockP">Stock</Link>
              </li>
              <li className="nav-item mx-3">
                <Link className="nav-link large-link" to="/Cierre">Resumen</Link>
              </li>
              <li className="nav-item mx-3">
                <div className="nav-link" onClick={handleAddToCart}>
                  <p className={`carrito`}>
                    <FaShoppingCart /> Orden ({carrito.Carrito.prods ? carrito.Carrito.prods.length : 0})
                  </p>
                </div>
              </li>

            </ul>
          </div>
        </nav>
      </header>
      
      <div className={`divPedir`}> 
        {/* Opcional: botón para realizar pedido */}
      </div>
    </>
  );
};
