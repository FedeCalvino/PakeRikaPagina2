import React, { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HeaderCss.css';
import { Link } from 'react-router-dom'; // Importa Link si estás usando react-router-dom
import { setPosition } from "./Features/PositionSlice";
import { useDispatch, useSelector } from 'react-redux';
import { setCarritoSlice } from './Features/CarritoSlice';
import { useNavigate } from 'react-router-dom';

export const HeaderPakeRika = ({ setcarrito }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductAdded, setIsProductAdded] = useState(false); // Estado para saber si se agregó un producto
  const dispatch = useDispatch();
  
  const carrito = useSelector((state) => state.Carrito); // Usar useSelector directamente en el componente

  useEffect(() => {
    // Obtener carrito de localStorage al iniciar
    const carritoLocalStorage = localStorage.getItem('carrito');
    if (carritoLocalStorage) {
      const carritoObjeto = JSON.parse(carritoLocalStorage);
      // Si no hay productos en el carrito de Redux, sincronizarlo con localStorage
      if (!carrito.prods || carrito.prods.length === 0) {
        dispatch(setCarritoSlice(carritoObjeto));
      }
    }

    // Manejar el evento de scroll para cambiar el estado del header
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
  }, [dispatch, carrito.prods]); // Dependencia de carrito.prods

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

  const handleAddToCart = () => {
    setcarrito(); // Lógica para agregar productos al carrito
    setIsProductAdded(true); // Activar el parpadeo cuando se agregue un producto
    setTimeout(() => setIsProductAdded(false), 2000); // Detener el parpadeo después de 2 segundos
  };

  const goToCheckOut =()=>{
    GetLocaltion()
    navigate("/CheckOut")
   }

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
                  <Link className="nav-link" to="/">Catalogo</Link>
                </li>
                <li className="nav-item">
                  <Link onClick={GetLocaltion} className="nav-link" to="/CheckOut">Check Out</Link>
                </li>
              </ul>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <div className="nav-link" onClick={handleAddToCart}>
                    <p className={`carrito ${isProductAdded ? 'parpadeo' : ''}`}>
                      <FaShoppingCart /> Carrito ({carrito.Carrito.prods ? carrito.Carrito.prods.length : 0})
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      
      <div className={`divPedir`}> {/* Agregar clase si se ha hecho scroll */}
        {carrito.Carrito.prods && carrito.Carrito.prods.length > 0 && (
          <button onClick={()=>goToCheckOut()} className={`botonPedir ${isProductAdded ? 'parpadeo' : ''}`}>
            Realizar Pedido
          </button>
        )}
      </div>
    </>
  );
};
