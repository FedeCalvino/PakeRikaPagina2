import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { HeaderPakeRika } from "./HeaderPakeRika";

// Registrar los componentes de Chart.js
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export const Datos = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState(
    new Date().toISOString().split("T")[0]
  ); // Día actual por defecto

  const fetchOrdenes = async () => {
    try {
      const response = await fetch(`/Ordenes`);
      const data = await response.json();
      setOrdenes(data);
    } catch (error) {
      console.error("Error fetching ordenes:", error);
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, []);

  const procesarDatos = () => {
    // Inicializar un array con índices del 8 al 23 (16 horas)
    const horas = Array(24).fill(0);

    ordenes.forEach((orden) => {
      const fechaOrden = new Date(orden.Dia);
      
      const fechaSeleccionada = new Date(fechaFiltro);
      fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1);
      if (
        fechaOrden.getFullYear() === fechaSeleccionada.getFullYear() &&
        fechaOrden.getMonth() === fechaSeleccionada.getMonth() &&
        fechaOrden.getDate() === fechaSeleccionada.getDate()
      ) {
        const hora = fechaOrden.getHours();
        if (hora >= 10 && hora <= 23) {
          horas[hora] += 1;
        }
      }
    });

    return {
      labels: horas
        .map((_, index) => index)
        .slice(10, 24)
        .map((hora) => `${hora}:00 - ${hora + 1}:00`),
      datasets: [
        {
          label: "Órdenes por Hora",
          data: horas.slice(8, 24),
          backgroundColor: "#36A2EB",
          borderWidth: 1,
        },
      ],
    };
  };

  const totalOrdenesDia = () => {
    return ordenes.reduce((total, orden) => {
      const fechaOrden = new Date(orden.Dia);
      const fechaSeleccionada = new Date(fechaFiltro);
      fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1);
      if (
        fechaOrden.getFullYear() === fechaSeleccionada.getFullYear() &&
        fechaOrden.getMonth() === fechaSeleccionada.getMonth() &&
        fechaOrden.getDate() === fechaSeleccionada.getDate()
      ) {
        return total + 1;
      }
      return total;
    }, 0);
  };

  const total = () => {
    return ordenes.reduce((total, orden) => {
      const fechaOrden = new Date(orden.Dia);
      const fechaSeleccionada = new Date(fechaFiltro);
      fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1);
      if (
        fechaOrden.getFullYear() === fechaSeleccionada.getFullYear() &&
        fechaOrden.getMonth() === fechaSeleccionada.getMonth() &&
        fechaOrden.getDate() === fechaSeleccionada.getDate()
      ) {
        return total + orden.Total;
      }
      return total;
    }, 0);
  };

  const calcularTotalesPorTipo = (tipo) => {
    const fechaSeleccionada = new Date(fechaFiltro);
    fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1);
    console.log("fechaSeleccionada",fechaSeleccionada)
    return ordenes.reduce((total, orden) => {
      const fechaOrden = new Date(orden.Dia);  
      if (
        fechaOrden.getFullYear() === fechaSeleccionada.getFullYear() &&
        fechaOrden.getMonth() === fechaSeleccionada.getMonth() &&
        fechaOrden.getDate() === fechaSeleccionada.getDate()
      ) {
        const productos = orden.Articulos || [];
        productos.forEach((producto) => {
          if (producto.Categoria === tipo) {
            total += producto.cantidad;
          }
        });
      }
      return total;
    }, 0);
  };

  const totalEmpanadas = calcularTotalesPorTipo("Empanadas");
  const totalBebidas = calcularTotalesPorTipo("Bebida");
  const totalPizzas = calcularTotalesPorTipo("Promo");

  return (
    <>
      <HeaderPakeRika />
      <div style={{ padding: "20px", margin: "0 auto" ,marginTop:"60px"}}>
        
      <div
  style={{
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center", 
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    padding: "5px 10px",
    boxSizing: "border-box",
  }}
>

  <button
    onClick={() => {
      const currentDate = new Date(fechaFiltro);
      currentDate.setDate(currentDate.getDate() - 1); // Restar un día
      setFechaFiltro(currentDate.toISOString().split("T")[0]);
    }}
    style={{
      background: "none",
      border: "none",
      fontSize: "1.5rem",
      color: "#333",
      cursor: "pointer",
      padding: "0 10px",
    }}
  >
    &#8592; {/* Flecha hacia la izquierda */}
  </button>

  <input
    type="date"
    value={fechaFiltro}
    onChange={(e) => setFechaFiltro(e.target.value)}
    style={{
      width: "150px",
      padding: "10px",
      fontSize: "1rem",
      border: "none",
      borderRadius: "5px",
      backgroundColor: "#f7f7f7",
      color: "#333",
      outline: "none",
    }}
  />

  <button
    onClick={() => {
      const currentDate = new Date(fechaFiltro);
      currentDate.setDate(currentDate.getDate() + 1); // Sumar un día
      setFechaFiltro(currentDate.toISOString().split("T")[0]);
    }}
    style={{
      background: "none",
      border: "none",
      fontSize: "1.5rem",
      color: "#333",
      cursor: "pointer",
      padding: "0 10px",
    }}
  >
    &#8594; {/* Flecha hacia la derecha */}
  </button>
</div>

        <div style={{ display: "flex", gap: "20px" }}>
          <div
            style={{
              flex: "2",
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <Bar
              data={procesarDatos()}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true, position: "top" },
                  title: {
                    display: true,
                    text: `Órdenes por Hora (${fechaFiltro})`,
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      autoSkip: false, // Asegura que todas las etiquetas sean visibles
                    },
                  },
                  y: {
                    beginAtZero: true, // Asegura que el eje Y comience desde 0
                    ticks: {
                      stepSize: 1, // Incrementa el eje Y de 1 en 1
                    },
                  },
                },
              }}
            />
          </div>
          <div
            style={{
              flex: "1",
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                fontSize: "1.5rem",
                marginBottom: "10px",
                color: "#333",
              }}
            >
              Totales del Día
            </h2>
            <div style={{ fontSize: "1.2rem", color: "#555" }}>
              <p>
                Órdenes: <strong>{totalOrdenesDia()}</strong>
              </p>
              <p>
                Empanadas: <strong>{totalEmpanadas}</strong>
              </p>
              <p>
                Bebidas: <strong>{totalBebidas}</strong>
              </p>
              <p>
                Pizzas: <strong>{totalPizzas}</strong>
              </p>
            </div>
          </div>
        </div>
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginTop: "20px",
            borderRadius: "12px",
            backgroundColor: "#e8f5e9",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "2rem",
              color: "#2e7d32",
              fontWeight: "bold",
              margin: "0",
            }}
          >
            Total : <span style={{ fontSize: "2.5rem" }}>{total()}</span>
          </p>
        </div>
      </div>
    </>
  );
};
