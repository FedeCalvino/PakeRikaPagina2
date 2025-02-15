import React, { useState, useEffect } from "react";
import { HeaderPakeRika } from "./HeaderPakeRika";

export const Ordenes = () => {
  const [ordenesPorDia, setOrdenesPorDia] = useState({});
  const [dias, setDias] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  const [Local, setLocal] = useState(() => {
    const storedLocal = sessionStorage.getItem('local');
    return storedLocal ? JSON.parse(storedLocal) : null;
  });


  useEffect(() => {

    const fetchOrdenes = async () => {
      try {
        const response = await fetch(`/Ordenes`);
        const data = await response.json();
  
        // Agrupar órdenes por día
        const agrupadas = data.reduce((acc, orden) => {
          const fecha = new Date(orden.Dia).toLocaleDateString();
          acc[fecha] = acc[fecha] || [];
          acc[fecha].push(orden);
          return acc;
        }, {});
  
        // Invertir el orden de las claves de agrupadas
        const diasOrdenados = Object.keys(agrupadas).reverse();
        const newAgrupadas = diasOrdenados.reduce((acc, dia) => {
          acc[dia] = agrupadas[dia];
          return acc;
        }, {});
  
        setOrdenesPorDia(newAgrupadas);
        setDias(diasOrdenados);
        setDiaSeleccionado(diasOrdenados[0]); // Seleccionar el primer día
      } catch (error) {
        console.error("Error fetching ordenes:", error);
      }
    };
  
    fetchOrdenes();
  }, []);
  

  return (
    <div style={{ margin: "20px", marginTop: "80px" }}>
      <HeaderPakeRika />
      <h1 style={{ marginBottom: "20px", fontSize: "1.5rem" }}>
        Órdenes
      </h1>
      <div style={{ marginBottom: "20px" }}>
        {dias.map((dia) => (
          <button
            key={dia}
            onClick={() => setDiaSeleccionado(dia)}
            style={{
              margin: "5px",
              padding: "10px",
              width:"110px",
              borderRadius: "5px",
              background: dia === diaSeleccionado ? "#007bff" : "#f0f0f0",
              color: dia === diaSeleccionado ? "#fff" : "#000",
              cursor: "pointer",
            }}
          >
            {dia}
          </button>
        ))}
      </div>

      {/* Mostrar órdenes del día seleccionado */}
      {diaSeleccionado && (
        <div>
          {ordenesPorDia[diaSeleccionado]
            .slice()
            .reverse()
            .map((orden) => (
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
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                    }}
                  >
                    <img
                      src="/pedidosya-logo.png"
                      alt="PedidosYa Logo"
                      style={{ width: "70px", height: "auto", borderRadius: "13px" }}
                    />
                  </div>
                )}
                {orden.Rappi && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                    }}
                  >
                    <img
                      src="/Rappi.png"
                      alt="Rappi Logo"
                      style={{ width: "130px", height: "auto", borderRadius: "13px" }}
                    />
                  </div>
                )}
                <div style={{ marginBottom: "10px", fontSize: "0.9rem" }}>
                  <strong>Fecha:</strong>{" "}
                  {new Date(orden.Dia).toLocaleDateString()} <br />
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
                      <th
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: "6px",
                          textAlign: "left",
                        }}
                      >
                        Nombre
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: "6px",
                          textAlign: "left",
                        }}
                      >
                        Categoría
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: "6px",
                          textAlign: "left",
                        }}
                      >
                        Precio
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: "6px",
                          textAlign: "left",
                        }}
                      >
                        Cantidad/Peso
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orden.Articulos.map((articulo, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            borderBottom: "1px solid #ddd",
                            padding: "6px",
                          }}
                        >
                          {articulo.Nombre}
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #ddd",
                            padding: "6px",
                          }}
                        >
                          {articulo.Categoria}
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #ddd",
                            padding: "6px",
                          }}
                        >
                          ${articulo.Precio}
                        </td>
                        { 
                        articulo.UnidadPeso==="Peso" ?
                        <td
                          style={{
                            borderBottom: "1px solid #ddd",
                            padding: "6px",
                          }}
                        >
                          {articulo.Peso}Kg
                        </td>
                        :
                        <td
                          style={{
                            borderBottom: "1px solid #ddd",
                            padding: "6px",
                          }}
                        >
                          {articulo.cantidad}
                        </td>
                        }
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
