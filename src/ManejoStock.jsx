import React, { useState, useEffect } from "react";
import { HeaderPakeRika } from "./HeaderPakeRika";

export default function ManejoStock() {
  const [Artiuclos, setArticulos] = useState([]);
  const [ArtiuclosUpdate, setArtiuclosUpdate] = useState([]);
  const [ordenes, setOrdenes] = useState([]);

  const fetchArticulos = async () => {
    try {
      const response = await fetch(`/articulos`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("data", data);
      setArticulos(data);
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  };
  const fetchOrdenes = async () => {
    try {
        const response = await fetch(`/Ordenes`);
        console.log("response",response)
        const data = await response.json();
        setOrdenes(data);
    } catch (error) {
        console.error('Error fetching ordenes:', error);
    }
    };

  useEffect(() => {
    fetchArticulos();
    fetchOrdenes()
  }, []);

  const handleStockChange = (prod, field, value) => {
    const updatedProducts = Artiuclos.map((product) =>
      product._id === prod._id ? { ...product, [field]: parseInt(value) || 0 } : product
    );
    setArticulos(updatedProducts);

    const newProd = updatedProducts.find((product) => product._id === prod._id);

    const isProductInUpdate = ArtiuclosUpdate.some((product) => product._id === prod._id);
    if (!isProductInUpdate) {
      setArtiuclosUpdate((prev) => [...prev, newProd]);
    }
  };

  const handleSave = async () => {
    try {
      const updatePromises = Artiuclos.map(async (arti) => {
        const response = await fetch( `/UpdateStock/${arti._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              stockRivera: arti.StockRivera,
              stockColonia: arti.StockColonia,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Error al actualizar el stock");
        }

        const data = await response.json();
        console.log("Producto actualizado:", data);
      });

      await Promise.all(updatePromises);
      console.log("Todos los productos se han actualizado correctamente.");

      // Mostrar alerta de éxito
      window.alert("¡Stock actualizado correctamente!");
    } catch (error) {
      console.error("Error al actualizar stock:", error);
      // Mostrar alerta de error
      window.alert("Hubo un error al guardar el stock. Inténtalo de nuevo.");
    }
  };
  const GetCantidad=(producto,local)=>{
    let cant=0;
    ordenes.map(orden=>{
        if(orden.Local===local){
            let artF = orden.Articulos.find(art=>art._id===producto._id)
            if(artF){
                cant += artF.cantidad
            }
        }
    })
    return cant
  }

  return (
    <>
      <HeaderPakeRika />
      <div style={styles.container}>
        <h1 style={styles.title}>Stock</h1>
        <div style={styles.tablesContainer}>
          {/* Primera Tabla */}
          <div style={styles.tableWrapper}>
            <h2 style={styles.tableTitle}>Rivera</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Stock</th>
                </tr>
              </thead>
              <tbody>
                {Artiuclos.map((product) => (
                  <tr key={product._id}>
                    <td style={styles.td}>{product.Nombre}</td>
                    <td style={styles.td}>
                      <input
                        type="number"
                        value={product.StockRivera}
                        onChange={(e) =>
                          handleStockChange(product, "StockRivera", e.target.value)
                        }
                        style={styles.input}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Segunda Tabla */}
          <div style={styles.tableWrapper}>
            <h2 style={styles.tableTitle}>Colonia</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Stock</th>
                </tr>
              </thead>
              <tbody>
                {Artiuclos.map((product) => (
                  <tr key={product._id}>
                    <td style={styles.td}>{product.Nombre}</td>
                    <td style={styles.td}>
                      <input
                        type="number"
                        value={product.StockColonia}
                        onChange={(e) =>
                          handleStockChange(product, "StockColonia", e.target.value)
                        }
                        style={styles.input}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <button onClick={handleSave} style={styles.button}>
          Guardar Cambios
        </button>
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  tablesContainer: {
    display: "flex",
    gap: "20px",
    justifyContent: "space-between",
  },
  tableWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    padding: "10px",
  },
  tableTitle: {
    textAlign: "center",
    color: "#555",
    marginBottom: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#007bff",
    color: "#fff",
    textAlign: "center",
    padding: "10px",
  },
  td: {
    textAlign: "center",
    padding: "8px",
    borderBottom: "1px solid #ddd",
  },
  input: {
    width: "100%",
    padding: "5px",
    fontSize: "14px",
    textAlign: "center",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    display: "block",
    margin: "20px auto",
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#28a745",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  },
};
