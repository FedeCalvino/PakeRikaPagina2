import React, { useState, useEffect } from "react";
import { HeaderPakeRika } from "./HeaderPakeRika";
import { Toaster, toast } from "react-hot-toast";

export const Ordenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [Local, setLocal] = useState(() => {
    const storedLocal = sessionStorage.getItem("local");
    return storedLocal ? JSON.parse(storedLocal) : null;
  });

  const [fecha, setFecha] = useState(() => {
    const now = new Date();
    now.setHours(now.getHours() - 2); // Restar 2 horas
    return now.toISOString().split("T")[0]; // Formato yyyy-MM-dd
  });

  const fetchOrdenes = async (fecha) => {
    const url =`/OrdenesFecha?local=${Local}&fecha=${fecha}`
    console.log(url)
    try {
      const response = await fetch(
        url
      );
      const data = await response.json();
      console.log("data", data);
      setOrdenes(data);
    } catch (error) {
      console.error("Error fetching ordenes:", error);
    }
  };

  const deleteOrder= async (orden)=>{
    try {
      const requestOptions ={
        method:"DELETE",
      headers: {
        "Content-Type": "application/json",
      }
      }
      const response = await fetch(`/OrdenPakeRika/`+orden._id,requestOptions);
      const res = await response.json();

      fetchOrdenes(fecha)
      toast.success("venta eliminada")
    } catch (error) {
      console.error("Error fetching ordenes:", error);
    }
  }

  useEffect(() => {
    fetchOrdenes(fecha);
  }, [fecha, Local]);

  // Funciones para cambiar la fecha
  const cambiarFecha = (dias) => {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    setFecha(nuevaFecha.toISOString().split("T")[0]);
  };

  return (
    <div style={{ margin: "20px", marginTop: "80px" }}>
      <HeaderPakeRika />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
  <h1 style={{ marginBottom: "20px", fontSize: "1.5rem" }}>Órdenes</h1>
  <div style={{ display: "flex", alignItems: "center", gap: "10px",marginBottom:"50px" }}>
    <button onClick={() => cambiarFecha(-1)} style={{ padding: "8px 12px", width: "60px" }}>
      {"<-"}
    </button>
    <input
      type="date"
      value={fecha}
      style={{ padding: "5px", textAlign: "center" }}
      onChange={(e) => setFecha(e.target.value)}
    />
    <button onClick={() => cambiarFecha(1)} style={{ padding: "8px 12px", width: "60px" }}>
      {"->"}
    </button>
  </div>
</div>

      {/* Mostrar órdenes del día seleccionado */}
      <div>
        {ordenes.map((orden) => (
          <div
            key={orden._id}
            style={{
              border: "1px solid #ddd",
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "5px",
              position: "relative",
            }}
          >
            {orden.PedidosYa && (
              <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <img
                  src="/pedidosya-logo.png"
                  alt="PedidosYa Logo"
                  style={{ width: "70px", height: "auto", borderRadius: "13px" }}
                />
              </div>
            )}
            {orden.Rappi && (
              <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <img
                  src="/Rappi.png"
                  alt="Rappi Logo"
                  style={{ width: "130px", height: "auto", borderRadius: "13px" }}
                />
              </div>
            )}
            <div
                key={orden._id}
                style={{
                  position: "absolute",
                  top:"10px",
                  right:"180px"
                }}
                onClick={()=>deleteOrder(orden)}
              >
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "#d32f2f",
                      padding :"5px",
                      borderRadius:"10px",
                      fontFamily:"serif",
                      color:"white",
                      cursor:"pointer"
                    }}
                  >
                   Eliminar
                  </div>
            </div>
            <div style={{ marginBottom: "10px", fontSize: "0.9rem" }}>
              <strong>Fecha:</strong> {new Date(orden.Dia).toLocaleDateString()} <br />
              <strong>Hora:</strong> {orden.Hora} <br />
              <strong>Pago:</strong> {orden.Pago} <br />
              <strong>Total:</strong> ${orden.Total}
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9rem",
              }}
            >
              <thead>
                <tr>
                  <th style={{ borderBottom: "1px solid #ddd", padding: "6px", textAlign: "left" }}>Nombre</th>
                  <th style={{ borderBottom: "1px solid #ddd", padding: "6px", textAlign: "left" }}>Categoría</th>
                  <th style={{ borderBottom: "1px solid #ddd", padding: "6px", textAlign: "left" }}>Precio</th>
                  <th style={{ borderBottom: "1px solid #ddd", padding: "6px", textAlign: "left" }}>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {orden.Articulos.map((articulo, index) => (
                  <tr key={index}>
                    <td style={{ borderBottom: "1px solid #ddd", padding: "6px" }}>{articulo.Nombre}</td>
                    <td style={{ borderBottom: "1px solid #ddd", padding: "6px" }}>{articulo.Categoria}</td>
                    <td style={{ borderBottom: "1px solid #ddd", padding: "6px" }}>${articulo.Precio}</td>
                    <td style={{ borderBottom: "1px solid #ddd", padding: "6px" }}>{articulo.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <div>
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              zIndex: 9999,
            },
          }}
        />
      </div>
    </div>
  );
};
