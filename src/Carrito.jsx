import React, { useEffect, useState } from 'react';
import "./Carrito.css";
import { useDispatch, useSelector } from 'react-redux';
import { updateProducto, updateTotal, clearCarritoSlice } from './Features/CarritoSlice';
import { useNavigate } from 'react-router-dom';
import { setPosition } from "./Features/PositionSlice";
import { Modal } from 'react-bootstrap';

export const Carrito = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const carrito = useSelector((state) => state.Carrito);
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [showNotification, setShowNotification] = useState(false);
  const port = 3078;
  //modal
  const [openModal, setOpenModal] = useState(false);

  const updateCarrito = (empanada, quantityChange) => {
    console.log("Actualizando carrito con empanada:", empanada, "Cantidad:", quantityChange);
    console.log("carrito", carrito)
    dispatch(updateProducto({ empanada, quantityChange }));
    dispatch(updateTotal({ empanada, quantityChange }));
  };
  const DeleteCarrito = () => {
    dispatch(clearCarritoSlice())
  }
  const goToCheckOut = () => {
    GetLocaltion()
    navigate("/CheckOut")
  }

  async function saveOrder() {
    if(carrito.Carrito.prods.length>0){
    const nuevaOrden = {
      Dia: new Date(),
      Pago: metodoPago,
      Hora: new Date().toLocaleTimeString(), // Obtener la hora actual del sistema
      Articulos: carrito.Carrito.prods,
      Total: carrito.Carrito.total-getDescuento()
    };
    console.log(nuevaOrden)
    try {
      const response = await fetch(`/SaveOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaOrden)
      });

      if (!response.ok) {
        throw new Error('Error al guardar la orden');
      } else {
        const result = await response.json();
        console.log('Orden guardada con éxito:', result);
        setShowNotification(true);
        DeleteCarrito();
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
    }
  }

  const agregarEmp = async () => {
    const articulos = [
      {
        Nombre: "Bebida 1 1/2",
        Precio: "195",
        Categoria: "Bebida"
      },{
        Nombre: "Bebida 600",
        Precio: "85",
        Categoria: "Bebida"
      }
    ]

    // Aquí puedes añadir los artículos a tu base de datos o realizar otras operaciones con ellos
    console.log(articulos);
    try {
      for (const articulo of articulos) {
        const response = await fetch(`http://200.40.89.254:3034/SaveEmp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(articulo)
        });

        if (!response.ok) {
          throw new Error('Error al enviar el artículo');
        }
        const data = await response.json();
        console.log('Artículo guardado:', data);
      }
    } catch (error) {
      console.error('Error al enviar los artículos:', error);
    }
  }
  const getDescuento = () => {
    let cantidadEmp = 0;
    let descuento = 0;
    let Bebidas600 = 0;
    let Bebidas15 = 0;
    let Promos = 0;
    carrito.Carrito.prods.forEach(prod => {
        if (prod.Categoria === "Empanadas") {
            cantidadEmp+=prod.cantidad;
        }
        console.log("prod.Categoria",prod.Categoria)
        if (prod.Categoria === "Bebida") {
          console.log("prod.Nombre",prod.Nombre)
          if(prod.Nombre==="Bebida 600"){
            Bebidas600+=prod.cantidad;
          }else{
            Bebidas15+=prod.cantidad;
          }
        }
        if (prod.Categoria === "Promo") {
          Promos+=prod.cantidad;
        }
    });
    while (cantidadEmp >= 6) {
        descuento += 131;
        cantidadEmp -= 6;
    }
    while (Promos >= 1 && Bebidas600>=1 || Bebidas15>=1) {
      if(Bebidas600>=1){
        descuento += 131;
        Bebidas600--
      }
      if(Bebidas15>=1>=1){
        descuento += 15;
        Bebidas15--
      }
    }

    while (cantidadEmp >= 3) {
        descuento += 53;
        cantidadEmp -= 3;
    }

    return descuento;
}

useEffect(() => {
    getDescuento();
}, [carrito.Carrito.prods]);





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
          switch (error.code) {
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
      {carrito.Carrito.prods.length === 0 ? (
        <p className="carrito-empty">No hay productos</p>
      ) : (
        carrito.Carrito.prods.map(prod => (
          <div key={prod._id} className="carrito-item">
            <span className="carrito-producto">{prod.Nombre}</span>
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
      <div
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginTop: '20px',
          textAlign: 'right',
          color: '#333',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '5px',
        }}
      >
        Subtotal: ${carrito.Carrito.total}
      </div>
      <div
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginTop: '20px',
          textAlign: 'right',
          color: '#333',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '5px',
        }}
      >
        Descuento: ${getDescuento()}
      </div>
      <div
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginTop: '20px',
          textAlign: 'right',
          color: '#333',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '5px',
        }}
      >
        Total: ${carrito.Carrito.total-getDescuento()}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', marginTop: "20px" }}>
        <label
          htmlFor="metodoPago"
          style={{
            backgroundColor: "white",
            width: "50%",
            fontSize: '16px'
          }}
        >
          Método de Pago:
        </label>
        <select
          id="metodoPago"
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          style={{
            padding: '8px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '100%',
            maxWidth: '300px'
          }}
        >
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="transferencia">Transferencia</option>
        </select>
      </div>

      <button
        className="Checkout-carrito"
        onClick={() => saveOrder()}
      >
        Crear Orden
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
            Eliminar Orden
          </button>
        </>
        :
        <button
          className="Delete-carrito"
          onClick={() => setOpenModal(true)}
        >
          Eliminar Orden
        </button>
      }
    </div>
  );
};
