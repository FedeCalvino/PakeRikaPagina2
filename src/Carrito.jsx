import React, { useEffect, useState } from "react";
import "./Carrito.css";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProducto,
  updateTotal,
  clearCarritoSlice,
} from "./Features/CarritoSlice";
import { useNavigate } from "react-router-dom";
import { setPosition } from "./Features/PositionSlice";
import { Modal } from "react-bootstrap";

export const Carrito = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const carrito = useSelector((state) => state.Carrito);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [showNotification, setShowNotification] = useState(false);
  const [disabledOk, setdisabledOk] = useState(false);
  const port = 3078;

  //modal
  const [openModal, setOpenModal] = useState(false);

  const [Local, setLocal] = useState(() => {
    const storedLocal = sessionStorage.getItem("local");
    return storedLocal ? JSON.parse(storedLocal) : null;
  });

  const [pedidoYa, setpedidoYa] = useState(false);
  const [Rappi, setRappi] = useState(false);

  const handleToggle = () => {
    setpedidoYa((prevState) => !prevState);
  };
  const handleToggleRappi =()=>{
    setRappi((prevState) => !prevState);
  }

  const updateCarrito = (empanada, quantityChange) => {
    console.log(
      "Actualizando carrito con empanada:",
      empanada,
      "Cantidad:",
      quantityChange
    );
    console.log("carrito", carrito);
    dispatch(updateProducto({ empanada, quantityChange }));
    dispatch(updateTotal({ empanada, quantityChange }));
  };
  const DeleteCarrito = () => {
    dispatch(clearCarritoSlice());
  };
  const goToCheckOut = () => {
    GetLocaltion();
    navigate("/CheckOut");
  };

  async function saveOrder() {
    if (carrito.Carrito.prods.length === 0) {
      console.warn("El carrito está vacío. No se puede crear una orden.");
      return;
    }

    setdisabledOk(true); // Deshabilitar el botón mientras se procesa la orden.

    const nuevaOrden = {
      Dia: new Date(),
      Pago: metodoPago,
      Hora: new Date().toLocaleTimeString(), // Obtener la hora actual del sistema
      Articulos: carrito.Carrito.prods,
      Total: carrito.Carrito.total + getDescuento(),
      Local: Local,
      PedidosYa: pedidoYa,
    };

    console.log("Orden a guardar:", nuevaOrden);

    try {
      const response = await fetch(`/SaveOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaOrden),
      });

      if (!response.ok) {
        throw new Error("Error al guardar la orden");
      }

      const result = await response.json();
      console.log("Orden guardada con éxito:", result);

      // Mostrar notificación y limpiar estado.
      setShowNotification(true);
      DeleteCarrito();
      setpedidoYa(false);
      navigate("/OrdenesP");
    } catch (error) {
      console.error("Error al guardar la orden:", error.message);
      alert("Hubo un problema al guardar la orden. Inténtalo de nuevo.");
    } finally {
      setdisabledOk(false); // Habilitar el botón nuevamente.
    }
  }

  const agregarEmp = async () => {
    const articulos = [
      {
        Nombre: "Samba",
        Precio: "55",
        Categoria: "Bebida",
        StockRivera: 0,
        StockColonia: 0,
      },
      {
        Nombre: "Smith 44",
        Precio: "65",
        Categoria: "Bebida",
        StockRivera: 0,
        StockColonia: 0,
      },
    ];

    // Aquí puedes añadir los artículos a tu base de datos o realizar otras operaciones con ellos
    console.log(articulos);
    try {
      for (const articulo of articulos) {
        const response = await fetch(`/SaveEmp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(articulo),
        });

        if (!response.ok) {
          throw new Error("Error al enviar el artículo");
        }
        const data = await response.json();
        console.log("Artículo guardado:", data);
      }
    } catch (error) {
      console.error("Error al enviar los artículos:", error);
    }
  };
  const getDescuento = () => {
    let cantidadEmp = 0;
    let descuento = 0;
    let Bebidas600 = 0;
    let Samba = 0;
    let Smith = 0;
    let Bebidas15 = 0;
    let Promos = 0;
    let Smith500 = 0;
    let Zapi=0;

    carrito.Carrito.prods.forEach((prod) => {
      if (prod.Categoria === "Empanadas") {
        cantidadEmp += prod.cantidad;
      }
      console.log("prod.Categoria", prod.Categoria);
      if (prod.Categoria === "Bebida") {
        console.log("prod.Nombre", prod.Nombre);
        if (prod.Nombre === "Bebida 600ml") {
          Bebidas600 += prod.cantidad;
        } else if (prod.Nombre === "Smith 44") {
          Smith += prod.cantidad;
        } else if (prod.Nombre === "Smith 500ml") {
          Smith500 += prod.cantidad;
        } else if (prod.Nombre === "Samba") {
          Samba += prod.cantidad;
        } else {
          Bebidas15 += prod.cantidad;
        }
      }
      if (prod.Categoria === "Zapi") {
          Zapi++
      }
      if (prod.Categoria === "Promo") {
        if (prod.Nombre != "Marcianito") {
          Promos += prod.cantidad;
        }
      }
    });
    if (!pedidoYa) {
      if (cantidadEmp === 2) {
        descuento -= 32;
        Promos++;
        cantidadEmp -= 2;
      }
      while (cantidadEmp >= 6) {
        descuento -= 131;
        cantidadEmp -= 6;
        Promos++;
      }
      while (cantidadEmp >= 3) {
        descuento -= 53;
        cantidadEmp -= 3;
        Promos++;
      }
      while (
        (Promos >= 1 && Bebidas600 >= 1) ||
        (Promos >= 1 && Bebidas15 >= 1) ||
        (Promos >= 1 && Smith >= 1) ||
        (Promos >= 1 && Samba >= 1) ||
        (Promos >= 1 && Smith500 >= 1) ||
        (Zapi>=1 && Bebidas600 >= 1)
      ) {
        if (Promos >= 1 && Bebidas600 >= 1) {
          descuento -= 15;
          Bebidas600--;
          Promos--;
        }
        if (Promos >= 1 && Bebidas15 >= 1) {
          descuento -= 45;
          Bebidas15--;
          Promos--;
        }
        if (Promos >= 1 && Smith >= 1) {
          descuento -= 20;
          Smith--;
          Promos--;
        }
        if (Promos >= 1 && Samba >= 1) {
          descuento -= 10;
          Samba--;
          Promos--;
        }
        if (Promos >= 1 && Smith500 >= 1) {
          descuento -= 10;
          Smith500--;
          Promos--;
        }
        if (Zapi >= 1 && Bebidas600 >= 1) {
          descuento -= 15;
          Bebidas600--;
          Zapi--;
        }
      }
    } else {
      if (cantidadEmp === 3 && Bebidas600 === 1) {
        descuento -= 24;
        Promos++;
        cantidadEmp -= 2;
      }
      if (cantidadEmp === 6 && Bebidas15 === 1) {
        descuento -= 48;
        Promos++;
        cantidadEmp -= 2;
      }
    }

    return descuento;
  };

  useEffect(() => {
    getDescuento();
  }, [carrito.Carrito.prods, pedidoYa]);

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
          localStorage.setItem(
            "position",
            JSON.stringify([
              position.coords.latitude,
              position.coords.longitude,
            ])
          );
          dispatch(
            setPosition([position.coords.latitude, position.coords.longitude])
          );
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
              console.log(
                "La solicitud para obtener la ubicación ha caducado."
              );
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
          maximumAge: 0, // No guardar en caché la ubicación
        }
      );
    } else {
      console.log("La geolocalización no es soportada por este navegador.");
    }
  };

  return (
    <div style={{ marginTop: "70px" }} className="carrito-container">
      <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // Para distribuir los elementos
    gap: "20px",
  }}
>
  {/* Contenedor Pedidos Ya */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px", // Espacio entre el texto y el botón
    }}
  >
    <h4 style={{ margin: 0 }}>Pedidos Ya</h4>
    <div
      onClick={handleToggle}
      style={{
        width: "60px",
        height: "30px",
        backgroundColor: pedidoYa ? "#ff0000" : "#ccc",
        borderRadius: "30px",
        display: "flex",
        alignItems: "center",
        padding: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s",
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: "#fff",
          borderRadius: "50%",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          transform: pedidoYa ? "translateX(30px)" : "translateX(0)",
          transition: "transform 0.3s",
        }}
      ></div>
    </div>
  </div>

  {/* Línea divisoria */}
  <div
    style={{
      height: "40px", // Altura de la línea
      width: "2px",
      backgroundColor: "#ccc",
    }}
  ></div>

  {/* Contenedor Rappi */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px", // Espacio entre el texto y el botón
    }}
  >
    <h4 style={{ margin: 0 }}>Rappi</h4>
    <div
      onClick={handleToggleRappi}
      style={{
        width: "60px",
        height: "30px",
        backgroundColor: Rappi ? "#ff0000" : "#ccc",
        borderRadius: "30px",
        display: "flex",
        alignItems: "center",
        padding: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s",
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: "#fff",
          borderRadius: "50%",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          transform: Rappi ? "translateX(30px)" : "translateX(0)",
          transition: "transform 0.3s",
        }}
      ></div>
    </div>
  </div>
</div>

      {carrito.Carrito.prods.length === 0 ? (
        <p className="carrito-empty">No hay productos</p>
      ) : (
        carrito.Carrito.prods.map((prod) => (
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
            <p className="precio">$ {prod.cantidad * prod.Precio}</p>
          </div>
        ))
      )}
      <div
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginTop: "20px",
          textAlign: "right",
          color: "#333",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "5px",
        }}
      >
        Subtotal: ${carrito.Carrito.total}
      </div>
      <div
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginTop: "20px",
          textAlign: "right",
          color: "#333",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "5px",
        }}
      >
        Descuento: ${getDescuento()}
      </div>
      <div
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginTop: "20px",
          textAlign: "right",
          color: "#333",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "5px",
        }}
      >
        Total: ${carrito.Carrito.total + getDescuento()}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
          marginTop: "20px",
        }}
      >
        <label
          htmlFor="metodoPago"
          style={{
            backgroundColor: "white",
            width: "50%",
            fontSize: "16px",
          }}
        >
          Método de Pago:
        </label>
        <select
          id="metodoPago"
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          style={{
            padding: "8px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100%",
            maxWidth: "300px",
          }}
        >
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="transferencia">Transferencia</option>
        </select>
      </div>
      {disabledOk ? null : (
        <>
          <button className="Checkout-carrito" onClick={() => saveOrder()}>
            Crear Orden
          </button>

          {openModal ? (
            <>
              <button
                className="cancelarEliminar-carrito"
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                Cancelar
              </button>
              <button
                className="Delete-carritoSeguro"
                onClick={() => {
                  DeleteCarrito();
                  setOpenModal(false);
                }}
              >
                Eliminar Orden
              </button>
            </>
          ) : (
            <button
              className="Delete-carrito"
              onClick={() => setOpenModal(true)}
            >
              Eliminar Orden
            </button>
          )}
        </>
      )}
    </div>
  );
};
