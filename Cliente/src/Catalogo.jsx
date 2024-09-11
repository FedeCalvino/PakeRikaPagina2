import React, { useState, useEffect } from 'react';
import './Catalogo.css';
import { HeaderPakeRika } from './HeaderPakeRika';
import { Carrito } from './Carrito';
import { useDispatch,useSelector } from 'react-redux';
import { setCarritoSlice } from './Features/CarritoSlice';
import { updateProducto, updateTotal } from './Features/CarritoSlice';
export const Catalogo = () => {

  const [empanadas, setEmpanadas] = useState([]);
  const [highlightedId, setHighlightedId] = useState(null);
  const [highlightedIdR, setHighlightedIdR] = useState(null);
  const [carritoVisible, setCarritoVisible] = useState(false);

  const carrito = useSelector((state) => state.Carrito);

  const port = 3019;

  const dispatch = useDispatch();

  useEffect(() => {
    fetchEmpanadas();

  }, []);

  const fetchEmpanadas = async () => {
    try {
      const response = await fetch(`http://localhost:${port}/empanadas`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setEmpanadas(data);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
    const CarritoGuardado = localStorage.getItem('carrito');

    console.log("CarritoGuardado",CarritoGuardado)
    if(CarritoGuardado){
      const carritoObjeto = JSON.parse(CarritoGuardado)
      console.log("carritoObjeto",carritoObjeto)
      dispatch(setCarritoSlice(carritoObjeto))
    }
  };

  const toggleCarrito = () => {
    console.log(carrito)
    setCarritoVisible(prev => !prev);
  };

  const updateCarrito = (empanada, quantityChange) => {
    console.log("Actualizando carrito con empanada:", empanada, "Cantidad:", quantityChange);
    console.log("carrito",carrito)
    dispatch(updateProducto({ empanada, quantityChange }));
    dispatch(updateTotal({ empanada, quantityChange }));
  };
 

  const addEmpanada = (empanada) => {
    setHighlightedId(empanada._id);
    updateCarrito(empanada, 1);
    setTimeout(() => setHighlightedId(null), 300);
  };

  const removeEmpanada = (empanada) => {
    setHighlightedIdR(empanada._id);
    updateCarrito(empanada, -1);
    setTimeout(() => setHighlightedIdR(null), 300);
  };

  const getCantidadEmpanada = (id) => {
      const empanadaInCarrito = carrito.Carrito.prods ? carrito.Carrito.prods.find(item => item._id === id) : null;
      return empanadaInCarrito ? empanadaInCarrito.cantidad : 0;
  };
  

  return (
    <>
      <HeaderPakeRika setcarrito={toggleCarrito} />
      <div className="App">
        <h1>Empanadas</h1>
        <div className={ carritoVisible ? "grid-container" : "grid-containerFull"}>
          {empanadas.map(empanada => (
            <div className={`card ${highlightedId === empanada._id && 'highlight'} ${highlightedIdR === empanada._id && 'highlightR'}`} key={empanada._id}>
              {getCantidadEmpanada(empanada._id) > 0 && (
                <>
                  <img
                    className='remove-btn'
                    src="./borrar-removebg.png"
                    alt="Eliminar"
                    onClick={() => removeEmpanada(empanada)}
                  />
                  <div className="quantity-badge">
                    {getCantidadEmpanada(empanada._id)}
                  </div>
                </>
              )}
              <div className='cartaAdd' onClick={() => addEmpanada(empanada)}>
                <img
                  style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
                  src="empanada-removebg.png"
                  alt={empanada.nombre}
                />
                <h2>{empanada.nombre}</h2>
                <p className='ingredientes'>{empanada.ingredientes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {carritoVisible && (
        <div className='carritoDiv'>
          <Carrito/>
        </div>
      )}
    </>
  );
};
