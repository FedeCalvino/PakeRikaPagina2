import React,{useState} from 'react';
import "./Carrito.css";
import { useDispatch,useSelector } from 'react-redux';
import { updateProducto, updateTotal,clearCarritoSlice } from './Features/CarritoSlice';


export const Carrito = () => {

  const dispatch = useDispatch();
  const carrito = useSelector((state) => state.Carrito);

  //modal
  const [openModal, setOpenModal] = useState(false);

  const updateCarrito = (empanada, quantityChange) => {
    console.log("Actualizando carrito con empanada:", empanada, "Cantidad:", quantityChange);
    console.log("carrito",carrito)
    dispatch(updateProducto({ empanada, quantityChange }));
    dispatch(updateTotal({ empanada, quantityChange }));
  };
 const DeleteCarrito=()=>{
    dispatch(clearCarritoSlice())
 }

  const addEmpanada = (empanada) => {
    updateCarrito(empanada, 1);
  };

  const removeEmpanada = (empanada) => {
    updateCarrito(empanada, -1);
  };


  return (
    <div className="carrito-container">
      <h2>Carrito</h2>
      {carrito.Carrito.prods.length === 0 ? (
        <p className="carrito-empty">No hay productos en el carrito.</p>
      ) : (
        carrito.Carrito.prods.map(prod => (
          <div key={prod._id} className="carrito-item">
            <span className="carrito-producto">{prod.nombre}</span>
            <div className="carrito-controles">
              <button
                className="carrito-boton-menos"
                onClick={() => removeEmpanada(prod)}
              >
                -
              </button>
              <span className="carrito-cantidad">{prod.cantidad}</span>
              <button
                className="carrito-boton"
                onClick={() => addEmpanada(prod)}
              >
                +
              </button>
            </div>
            <p className='precio'>$ {prod.cantidad*prod.Precio}</p>
          </div>
        ))
      )}
      Total : {carrito.Carrito.total}
      <button
                className="Checkout-carrito"
                onClick={() => DeleteCarrito()}
              >
                Check Out
      </button>
      {openModal ? 
      <>
            <button
            className="cancelarEliminar-carrito"
            onClick={() => {
              setOpenModal(false)
            }
            }
          >
            Cancelar
      </button>
            <button
            className="Delete-carritoSeguro"
            onClick={() => {
              DeleteCarrito() 
              setOpenModal(false)
            }
            }
          >
            Eliminar Carrito
      </button>
      </>
      :
      <button
                className="Delete-carrito"
                onClick={() => setOpenModal(true)}
              >
                Eliminar Carrito
      </button>
      }
    </div>
  );
};
