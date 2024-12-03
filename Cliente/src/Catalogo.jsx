import React, { useState, useEffect } from 'react';
import './Catalogo.css';
import { HeaderPakeRika } from './HeaderPakeRika';
import { Carrito } from './Carrito';
import { useDispatch,useSelector } from 'react-redux';
import { setCarritoSlice } from './Features/CarritoSlice';
import { updateProducto, updateTotal } from './Features/CarritoSlice';
export const Catalogo = () => {

  const [Artiuclos, setArticulos] = useState([]);
  const [highlightedId, setHighlightedId] = useState(null);
  const [highlightedIdR, setHighlightedIdR] = useState(null);
  const [carritoVisible, setCarritoVisible] = useState(true);

  const carrito = useSelector((state) => state.Carrito);

  const port = 3079;

  const dispatch = useDispatch();

  useEffect(() => {
    const CarritoGuardado = localStorage.getItem('carrito');

    console.log("CarritoGuardado",CarritoGuardado)

    if(CarritoGuardado){
      const carritoObjeto = JSON.parse(CarritoGuardado)
      console.log("carritoObjeto",carritoObjeto)
      dispatch(setCarritoSlice(carritoObjeto))
    }

    fetchArticulos();
  }, []);
  
  useEffect(() => {
    console.log("carrito gu")
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const fetchArticulos = async () => {
    try {
    const response = await fetch(`/api/articulosAll`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log("data",data);
    setArticulos(data);  // Corrected typo
} catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
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
    localStorage.setItem('carrito', JSON.stringify(carrito));
  };
 

  const addArticulo= (empanada) => {
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
        <div className={ carritoVisible ? "grid-container" : "grid-containerFull"}>
          {Artiuclos.map(Artiuclo => (
            <div className={`card ${highlightedId === Artiuclo._id && 'highlight'} ${highlightedIdR === Artiuclo._id && 'highlightR'}`} key={Artiuclo._id}>
              {getCantidadEmpanada(Artiuclo._id) > 0 && (
                <>
                  <img
                    className='remove-btn'
                    src="./borrar-removebg.png"
                    alt="Eliminar"
                    style={{userSelect:"none"}}
                    onClick={() => removeEmpanada(Artiuclo)}
                  />
                  <div className="quantity-badge" style={{userSelect:"none"}}>
                    {getCantidadEmpanada(Artiuclo._id)}
                  </div>
                </>
              )}
              <div className='cartaAdd' onClick={() => addArticulo(Artiuclo)}>
                <img
                  style={{ width: '100%', maxWidth: '400px', height: 'auto',userSelect:"none"}}
                  src="empanada-removebg.png"
                  alt={Artiuclo.Nombre}
                />
                <h2>{Artiuclo.Nombre}</h2>
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