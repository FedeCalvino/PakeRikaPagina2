import React,{useState} from 'react';
import "./Carrito.css";
import { useDispatch,useSelector } from 'react-redux';
import { updateProducto, updateTotal,clearCarritoSlice } from './Features/CarritoSlice';
import { useNavigate } from 'react-router-dom';
import { setPosition } from "./Features/PositionSlice";

export const Carrito = () => {
  const navigate = useNavigate();
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
 const goToCheckOut =()=>{
  GetLocaltion()
  navigate("/CheckOut")
 }

  const addEmpanada = (empanada) => {
    updateCarrito(empanada, 1);
  };

  const removeEmpanada = (empanada) => {
    updateCarrito(empanada, -1);
  };

  const GetLocaltion = () => {
    // Verificar si la geolocalización es soportada
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Ubicación obtenida:", position);
          // Actualizar el estado con la posición actual
          localStorage.setItem('position', JSON.stringify([position.coords.latitude, position.coords.longitude]));
          dispatch(setPosition([position.coords.latitude, position.coords.longitude]));
        },
        (error) => {
          // Manejo detallado de errores
          switch(error.code) {
            case error.PERMISSION_DENIED:
              console.log("Permiso denegado por el usuario.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.log("La información de ubicación no está disponible.");
              break;
            case error.TIMEOUT:
              console.log("La solicitud para obtener la ubicación ha caducado.");
              break;
            case error.UNKNOWN_ERROR:
              console.log("Ha ocurrido un error desconocido.");
              break;
            default:
              console.log("Error obteniendo la ubicación:", error);
          }
        },
        {
          enableHighAccuracy: true, // Opcional: si necesitas mayor precisión
          timeout: 10000, // Tiempo de espera máximo
          maximumAge: 0 // No guardar en caché la ubicación
        }
      );
    } else {
      console.log('La geolocalización no es soportada por este navegador.');
    }
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
                onClick={() => goToCheckOut()}
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
