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
  const [User, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const carrito = useSelector((state) => state.Carrito);

  const [Local, setLocal] = useState(() => {
    const storedLocal = sessionStorage.getItem('local');
    return storedLocal ? JSON.parse(storedLocal) : null;
  });

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

  const changeLocal = () => {
    navigate("/");
  };

  return (
    <>
     <header className={isScrolled ? 'transparent-header' : ''}>
  <nav className="navbar navbar-light bg-light">
    <div className="container d-flex align-items-center justify-content-between">
      {/* Botón Salir */}
      <button
        className="btn btn-danger btn-sm"
        onClick={changeLocal}
      >
        Salir
      </button>

      {/* Navegación */}
      <ul className="navbar-nav d-flex flex-row mx-3">
        <li className="nav-item mx-2">
          <Link className="nav-link large-link" to="/CatologoP">Catálogo</Link>
        </li>
        <li className="nav-item mx-2">
          <Link className="nav-link large-link" to="/OrdenesP">Órdenes</Link>
        </li>
        <li className="nav-item mx-2">
          <Link className="nav-link large-link" to="/Cierre">Resumen</Link>
        </li>
        <li className="nav-item mx-2">
          <Link className="nav-link large-link" to="/StockP">Stock</Link>
        </li>
        <li className="nav-item mx-2">
          <Link className="nav-link large-link" to="/Extra">Extras</Link>
        </li>
      </ul>

      {/* Local */}
      {Local && (
        <div className="user-info text-nowrap">
          <span>{Local}</span>
        </div>
      )}
    </div>
  </nav>
</header>

    </>
  );
};