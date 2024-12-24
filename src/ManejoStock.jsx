import React, { useState, useEffect } from "react";
import { HeaderPakeRika } from "./HeaderPakeRika";
import { Modal, Button, Form } from "react-bootstrap";

export default function ManejoStock() {
  const [Artiuclos, setArticulos] = useState([]);
  const [ArtiuclosUpdate, setArtiuclosUpdate] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [productosAgregados, setProductosAgregados] = useState([]);
  const [Product, setProduct] = useState();
  const selectedProduct = Artiuclos.find((product) => product._id === Product);
  const [show, setshow] = useState(false);

  const [Local, setLocal] = useState(() => {
    const storedLocal = sessionStorage.getItem("local");
    return storedLocal ? JSON.parse(storedLocal) : null;
  });

  const [cantidadAgregar, setCantidadAgregar] = useState(0);

  const handleCantidadChange = (e) => {
    const cantidad = parseInt(e.target.value) || 0;
    setCantidadAgregar(cantidad);
  };

  const handleAddStockChange = (cantidadAgregar) => {
    if (!Product) {
      alert("Por favor, selecciona un producto");
      return;
    }
  
    // Verificar si el producto ya está en la lista
    const productoExistente = productosAgregados.find(
      (producto) => producto._id === selectedProduct._id
    );
  
    if (productoExistente) {
      alert("El producto ya está en la lista.");
      return;
    }
  
    const updatedProduct = { ...selectedProduct };
  
    if (Local === "Rivera") {
      updatedProduct.StockRivera += cantidadAgregar;
    } else {
      updatedProduct.StockColonia += cantidadAgregar;
    }
  
    setProductosAgregados([
      ...productosAgregados,
      {
        _id: updatedProduct._id,
        Nombre: updatedProduct.Nombre,
        cantidadAgregada: cantidadAgregar,
        StockColonia: updatedProduct.StockColonia,
        StockRivera: updatedProduct.StockRivera,
      },
    ]);
    console.log(productosAgregados)
  };
  

  const handleClose = () => {
    setshow(false);
  };
  const [nuevoStock, setNuevoStock] = useState({
    nombre: "",
    categoria: "",
    stockInicial: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoStock({
      ...nuevoStock,
      [name]: name === "stockInicial" ? parseInt(value) || 0 : value,
    });
  };

  const handleSubmit = () => {
    handleSave(nuevoStock);
    handleClose();
    setNuevoStock({ nombre: "", categoria: "", stockInicial: 0 });
  };

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
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  };
  const fetchOrdenes = async () => {
    try {
      const response = await fetch(`/Ordenes`);
      console.log("response", response);
      const data = await response.json();
      setOrdenes(data);
    } catch (error) {
      console.error("Error fetching ordenes:", error);
    }
  };
  const retStyleInput = (prodctQuantity) => {
    if (prodctQuantity > 5) return styles.input;

    if (prodctQuantity <= 5 && prodctQuantity > 2) return styles.input1;
    else return styles.input2;
  };
  const deleteProd = (id) => {
    console.log(id)
    const nuevosProductos=productosAgregados.filter((prod) => prod._id !== id);
    setProductosAgregados(nuevosProductos)
  };

  useEffect(() => {
    fetchArticulos();
    fetchOrdenes();
  }, []);

  const handleStockChange = (prod, field, value) => {
    const updatedProducts = Artiuclos.map((product) =>
      product._id === prod._id
        ? { ...product, [field]: parseInt(value) || 0 }
        : product
    );
    setArticulos(updatedProducts);

    const newProd = updatedProducts.find((product) => product._id === prod._id);

    const isProductInUpdate = ArtiuclosUpdate.some(
      (product) => product._id === prod._id
    );
    if (!isProductInUpdate) {
      setArtiuclosUpdate((prev) => [...prev, newProd]);
    }
  };
  const categories = ["Empanadas", "Bebida", "Promo"];

  const renderCategoryRows = (category) => {
    return Artiuclos.filter((product) => product.Categoria === category).map(
      (product) => (
        <div key={product._id} style={styles.row}>
          <span style={styles.name}>{product.Nombre}</span>
          <input
            type="number"
            value={product[`Stock${Local}`] || 0}
            onChange={(e) =>
              handleStockChange(product, `Stock${Local}`, e.target.value)
            }
            style={styles.input}
          />
        </div>
      )
    );
  };

  const handleSave = async () => {
    try {
      const updatePromises = productosAgregados.map(async (arti) => {
        const response = await fetch(`/UpdateStock/${arti._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stockRivera: arti.StockRivera,
            stockColonia: arti.StockColonia,
          }),
        });

        if (!response.ok) {
          throw new Error("Error al actualizar el stock");
        }

        const data = await response.json();
        console.log("Producto actualizado:", data);
      });

      await Promise.all(updatePromises);
      console.log("Todos los productos se han actualizado correctamente.");
      setshow(false)
      window.location.reload()
      // Mostrar alerta de éxito
      window.alert("¡Stock actualizado correctamente!");
    } catch (error) {
      console.error("Error al actualizar stock:", error);
      // Mostrar alerta de error
      window.alert("Hubo un error al guardar el stock. Inténtalo de nuevo.");
    }
  };

  const GetCantidad = (producto, local) => {
    let cant = 0;
    ordenes.map((orden) => {
      if (orden.Local === local) {
        let artF = orden.Articulos.find((art) => art._id === producto._id);
        if (artF) {
          cant += artF.cantidad;
        }
      }
    });
    return cant;
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Formulario de agregar stock */}
            <Form.Group controlId="formProducto">
              <Form.Label>Selecciona un Producto</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setProduct(e.target.value)}
              >
                <option value="">-- Selecciona un producto --</option>
                {Artiuclos.map((producto) => (
                  <option key={producto._id} value={producto._id}>
                    {producto.Nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Mostrar detalles del producto seleccionado */}
            {Product && (
              <>
                <Form.Group controlId="formStockActual" className="mt-3">
                  <Form.Label>Stock Actual</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      Local === "Colonia"
                        ? selectedProduct.StockColonia
                        : selectedProduct.StockRivera
                    }
                    readOnly
                  />
                </Form.Group>

                <Form.Group controlId="formCantidadAgregar" className="mt-3">
                  <Form.Label>Cantidad a Agregar</Form.Label>
                  <Form.Control
                    type="number"
                    value={cantidadAgregar || null}
                    onChange={(e) => handleCantidadChange(e)}
                    placeholder="Cantidad a agregar"
                  />
                </Form.Group>

                <Form.Group controlId="formStockFinal" className="mt-3">
                  <Form.Label>Stock Final</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      Local === "Colonia"
                        ? selectedProduct.StockColonia + cantidadAgregar
                        : selectedProduct.StockRivera + cantidadAgregar
                    }
                    readOnly
                  />
                </Form.Group>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddStockChange(cantidadAgregar);
                  }}
                  style={styles.button}
                >
                  Agregar
                </button>
              </>
            )}
          </Form>
          {productosAgregados.length > 0 && (
            <div className="mt-4">
              <h5>Productos Agregados</h5>
              <ul>
                {productosAgregados.map((producto) => (
                  <li key={producto._id} style={styles.productItem}>
                    <div style={styles.productInfo}>
                      <strong>{producto.Nombre}</strong> 
                      <p>- Agregados:{" "} {producto.cantidadAgregada} - Stock Final:{" "}
                      {Local === "Colonia"
                        ? producto.StockColonia
                        : producto.StockRivera}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                       deleteProd(producto._id);
                      }}
                      style={styles.button2}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
        <button onClick={handleSave} style={styles.button}>
          Creas Ingreso Stock
        </button>
          </Modal.Footer>
      </Modal>
      <HeaderPakeRika />
      <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h1 style={{ margin: 0, textAlign: 'center', flex: 1 }}>Stock</h1>
    <button onClick={() => setshow(true)} style={styles.button}>
        Ingreso Stock
    </button>
</div>

        <div style={styles.tablesContainer}>
          {Local === "Rivera" && (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <tbody>
                  <tr>
                    <td>
                      <h3>Empanadas</h3>
                      {Artiuclos.filter(
                        (product) => product.Categoria === "Empanadas"
                      ).map((product) => (
                        <div key={product._id} style={styles.row}>
                          <span style={styles.name}>{product.Nombre}</span>
                          <input
                            type="number"
                            readOnly
                            value={product.StockRivera || 0}
                            onChange={(e) =>
                              handleStockChange(
                                product,
                                "StockRivera",
                                e.target.value
                              )
                            }
                            style={retStyleInput(product.StockRivera || 0)}
                          />
                        </div>
                      ))}
                    </td>
                    <td style={{ verticalAlign: "Top" }}>
                      <h3>Bebidas</h3>
                      {Artiuclos.filter(
                        (product) =>
                          product.Categoria === "Bebida" ||
                          product.Categoria === "Agua"
                      ).map((product) => (
                        <div key={product._id} style={styles.row}>
                          <span style={styles.name}>{product.Nombre}</span>
                          <input
                            type="number"
                            readOnly
                            value={product.StockRivera || 0}
                            onChange={(e) =>
                              handleStockChange(
                                product,
                                "StockRivera",
                                e.target.value
                              )
                            }
                            style={retStyleInput(product.StockRivera || 0)}
                          />
                        </div>
                      ))}
                    </td>
                    <td style={{ verticalAlign: "Top" }}>
                      <h3>Promos</h3>
                      {Artiuclos.filter(
                        (product) =>
                          product.Categoria !== "Bebida" &&
                          product.Categoria !== "Empanadas" &&
                          product.Categoria !== "Agua"
                      ).map((product) => (
                        <div key={product._id} style={styles.row}>
                          <span style={styles.name}>{product.Nombre}</span>
                          <input
                            type="number"
                            readOnly
                            value={product.StockRivera || 0}
                            onChange={(e) =>
                              handleStockChange(
                                product,
                                "StockRivera",
                                e.target.value
                              )
                            }
                            style={retStyleInput(product.StockRivera || 0)}
                          />
                        </div>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {Local === "Colonia" && (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <tbody>
                  <tr>
                    <td>
                      <h3>Empanadas</h3>
                      {Artiuclos.filter(
                        (product) => product.Categoria === "Empanadas"
                      ).map((product) => (
                        <div key={product._id} style={styles.row}>
                          <span style={styles.name}>{product.Nombre}</span>
                          <input
                            type="number"
                            readOnly
                            value={product.StockColonia || 0}
                            onChange={(e) =>
                              handleStockChange(
                                product,
                                "StockColonia",
                                e.target.value
                              )
                            }
                            style={retStyleInput(product.StockColonia || 0)}
                          />
                        </div>
                      ))}
                    </td>
                    <td style={{ verticalAlign: "Top" }}>
                      <h3>Bebidas</h3>
                      {Artiuclos.filter(
                        (product) => product.Categoria === "Bebida"
                      ).map((product) => (
                        <div key={product._id} style={styles.row}>
                          <span style={styles.name}>{product.Nombre}</span>
                          <input
                            type="number"
                            readOnly
                            value={product.StockColonia || 0}
                            onChange={(e) =>
                              handleStockChange(
                                product,
                                "StockColonia",
                                e.target.value
                              )
                            }
                            style={retStyleInput(product.StockColonia || 0)}
                          />
                        </div>
                      ))}
                    </td>
                    <td style={{ verticalAlign: "Top" }}>
                      <h3>Promos</h3>
                      {Artiuclos.filter(
                        (product) => product.Categoria === "Promo"
                      ).map((product) => (
                        <div key={product._id} style={styles.row}>
                          <span style={styles.name}>{product.Nombre}</span>
                          <input
                            type="number"
                            readOnly
                            value={product.StockColonia || 0}
                            onChange={(e) =>
                              handleStockChange(
                                product,
                                "StockColonia",
                                e.target.value
                              )
                            }
                            style={retStyleInput(product.StockColonia || 0)}
                          />
                        </div>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: "20px",
    marginTop: "80px",
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
    padding: "8px",
    borderBottom: "2px solid #ddd", // Add a border to create lines below each row
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
  productItem: {
    marginBottom: "10px", // Add space between items
    padding: "10px", // Add padding to each list item
    backgroundColor: "#fff", // White background for each item
    borderRadius: "5px", // Rounded corners for list items
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", // Light shadow for list items
    display: "flex", // Use flexbox
    justifyContent: "space-between", // Space between content and button
    alignItems: "center", // Vertically align content
  },
  button2: {
    backgroundColor: "red",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    fontSize: "0.8rem",
    textAlign: "center", // Center the text inside the button
    padding: "5px 10px", // Add some padding to the button for better appearance
  },
  productList: {
    listStyleType: "none", // Remove default list styling
    padding: "10px", // Add padding to the list
    margin: "0", // Remove any default margin
    backgroundColor: "#f9f9f9", // Light background color for the list
    borderRadius: "5px", // Rounded corners for the list
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Add some shadow for depth
  },
  productInfo: {
    fontSize: "1rem", // Set font size for the product info
    color: "#333", // Set text color
  },
  row: {
    display: "flex",
    marginBottom: "10px",
    width: "100%",
    borderBottom: "2px solid #ddd", // Add a border below each row for separation
  },
  name: {
    padding: "5px",
    flex: 1,
    fontSize: "20px",
    fontWeight: "565",
  },

  input: {
    width: "200px",
    backgroundColor: "#eaeaea", // Gris claro azulado (Light Steel Blue), un tono suave y agradable
    color: "black",
    padding: "5px",
    fontSize: "21px",
    textAlign: "center",
  },
  input1: {
    width: "200px",
    backgroundColor: "#FFD700", // Dorado brillante, un amarillo agradable
    color: "black",
    padding: "5px",
    fontSize: "21px",
    textAlign: "center",
  },
  input2: {
    width: "200px",
    backgroundColor: "#FF6347", // Tomate, un rojo suave y bonito
    color: "black",
    padding: "5px",
    fontSize: "21px",
    textAlign: "center",
  },
};
