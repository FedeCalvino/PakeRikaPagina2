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

  const [Local, setLocal] = useState(() => {
    const storedLocal = sessionStorage.getItem("local");
    return storedLocal ? JSON.parse(storedLocal) : null;
  });

  const getLocalISOString = (date) => {
    const offset = date.getTimezoneOffset(); // Diferencia en minutos respecto al UTC
    const localDate = new Date(date.getTime() - offset * 60 * 1000); // Ajusta la fecha al huso local
    return localDate.toISOString().split("T")[0]; // Devuelve solo la parte de la fecha
  };

  const [fechaFiltro, setFechaFiltro] = useState(getLocalISOString(new Date()));

  const fetchOrdenes = async () => {
    try {
      const response = await fetch(
        `/OrdenesLocal?local=${Local}`
      );
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

  const calcularTotalesEfectivoPorRango = (inicio, fin) => {
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
        if (hora >= inicio && hora <= fin && orden.Pago === "Efectivo") {
          return total + orden.Total;
        }
      }
      return total;
    }, 0);
  };

  const total7a21 = calcularTotalesPorRango(7, 22);
  const totalEfectivo7a21 = calcularTotalesEfectivoPorRango(7, 22);
  const total20a24 = calcularTotalesPorRango(20, 23);
  const totalEfectivo20a24 = calcularTotalesEfectivoPorRango(20, 23);

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
            maxHeight: "500px",
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
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              flex: "1",
              padding: "10px",
              border: "1px solid #ddd",
              height: "500px",
              width: "100%",
              display:"flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bar
              data={procesarDatosPorRango(7, 21)}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true, position: "top" },
                  title: { display: true, text: "Órdenes de 12:00 a 16:00" },
                },
                ticks: {
                  stepSize: 1, // Incrementa el eje Y de 1 en 1
                },
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
                marginLeft:"20px"
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
                Total : <span style={{ fontSize: "2.5rem" }}>{total7a21.toFixed()}$</span>
              </p>
              <p
                style={{
                  fontSize: "2rem",
                  color: "#2e7d32",
                  fontWeight: "bold",
                  margin: "0",
                }}
              >
                Efectivo :{" "}
                <span style={{ fontSize: "2.5rem" }}>{totalEfectivo7a21.toFixed()}$</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
