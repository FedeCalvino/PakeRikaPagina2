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
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

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

  const procesarDatosPorRango = (inicio, fin) => {
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
        if (hora >= inicio && hora <= fin) {
          horas[hora] += 1;
        }
      }
    });

    return {
      labels: horas
        .map((_, index) => index)
        .slice(inicio, fin + 1)
        .map((hora) => `${hora}:00 - ${hora + 1}:00`),
      datasets: [
        {
          label: `Órdenes por Hora (${inicio}:00 - ${fin}:00)`,
          data: horas.slice(inicio, fin + 1),
          backgroundColor: "#36A2EB",
          borderWidth: 1,
        },
      ],
    };
  };
  
  

  const calcularTotalesPorRango = (inicio, fin) => {
    return ordenes.reduce((total, orden) => {
      const fechaOrden = new Date(orden.Dia);
      const fechaSeleccionada = new Date(fechaFiltro);
      fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1);

      if (
        fechaOrden.getFullYear() === fechaSeleccionada.getFullYear() &&
        fechaOrden.getMonth() === fechaSeleccionada.getMonth() &&
        fechaOrden.getDate() === fechaSeleccionada.getDate()
      ) {
        const hora = fechaOrden.getHours();
        if (hora >= inicio && hora <= fin) {
          return total + orden.Total;
        }
      }
      return total;
    }, 0);
  };

  const total12a16 = calcularTotalesPorRango(12, 16);
  const total20a24 = calcularTotalesPorRango(20, 23);

  return (
    <>
      <HeaderPakeRika />
      <div style={{ padding: "20px", margin: "0 auto", marginTop: "60px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => {
              const currentDate = new Date(fechaFiltro);
              currentDate.setDate(currentDate.getDate() - 1);
              setFechaFiltro(currentDate.toISOString().split("T")[0]);
            }}
          >
            &#8592;
          </button>
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />
          <button
            onClick={() => {
              const currentDate = new Date(fechaFiltro);
              currentDate.setDate(currentDate.getDate() + 1);
              setFechaFiltro(currentDate.toISOString().split("T")[0]);
            }}
          >
            &#8594;
          </button>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: "1", padding: "10px", border: "1px solid #ddd" }}>
            <Bar
              data={procesarDatosPorRango(12, 16)}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true, position: "top" },
                  title: { display: true, text: "Órdenes de 12:00 a 16:00" },
                },
                ticks: {
                    stepSize: 1, // Incrementa el eje Y de 1 en 1
                  }
              }}
            />
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
            Total : <span style={{ fontSize: "2.5rem" }}>{total12a16}</span>
          </p>
        </div>
          </div>
          <div style={{ flex: "1", padding: "10px", border: "1px solid #ddd" }}>
            <Bar
              data={procesarDatosPorRango(20, 24)}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true, position: "top" },
                  title: { display: true, text: "Órdenes de 20:00 a 24:00" },
                },
                ticks: {
                    stepSize: 1, // Incrementa el eje Y de 1 en 1
                }
              }}
            />
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
            Total : <span style={{ fontSize: "2.5rem" }}>{total20a24}</span>
          </p>
        </div>
          </div>
        </div>
      </div>
    </>
  );
};
