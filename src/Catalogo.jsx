import React, { useState, useEffect } from "react";
import "./Catalogo.css";
import { HeaderPakeRika } from "./HeaderPakeRika";
import { Carrito } from "./Carrito";
import { useDispatch, useSelector } from "react-redux";
import { setCarritoSlice } from "./Features/CarritoSlice";
import { updateProducto, updateTotal } from "./Features/CarritoSlice";
export const Catalogo = () => {
  const [Artiuclos, setArticulos] = useState([]);
  const [highlightedId, setHighlightedId] = useState(null);
  const [highlightedIdR, setHighlightedIdR] = useState(null);
  const [carritoVisible, setCarritoVisible] = useState(true);

  const carrito = useSelector((state) => state.Carrito);

  const port = 3079;

  const dispatch = useDispatch();

  useEffect(() => {

    const CarritoGuardado = localStorage.getItem("carrito");

    console.log("CarritoGuardado", CarritoGuardado);

    if (CarritoGuardado) {
      const carritoObjeto = JSON.parse(CarritoGuardado);
      console.log("carritoObjeto", carritoObjeto);
      dispatch(setCarritoSlice(carritoObjeto));
    }

    fetchArticulos();

  }, []);

  useEffect(() => {
    console.log("carrito gu");
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const fetchArticulos = async () => {
    try {
      const response = await fetch(`/articulos`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("data", data);
      setArticulos(data); // Corrected typo
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  };

  const toggleCarrito = () => {
    console.log(carrito);
    setCarritoVisible((prev) => !prev);
  };

  const updateCarrito = (Prod, quantityChange) => {
    console.log(
      "Actualizando carrito con empanada:",
      Prod,
      "Cantidad:",
      quantityChange
    );
    console.log("carrito", carrito);
    dispatch(updateProducto({ Prod, quantityChange }));
    if(Prod.UnidadPeso!=="Peso"){
      dispatch(updateTotal({ Prod, quantityChange }));
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
  };

  const addArticulo = (Articulo) => {
    if(Articulo.UnidadPeso!=="Peso" || getCantidad(Articulo._id)<1){
    setHighlightedId(Articulo._id);
    updateCarrito(Articulo, 1);
    setTimeout(() => setHighlightedId(null), 300);
    }
  };

  const removeEmpanada = (empanada) => {
    setHighlightedIdR(empanada._id);
    updateCarrito(empanada, -1);
    setTimeout(() => setHighlightedIdR(null), 300);
  };

  const getCantidad = (id) => {
    const InCarrito = carrito.Carrito.prods
      ? carrito.Carrito.prods.find((item) => item._id === id)
      : null;
    return InCarrito ? InCarrito.cantidad : 0;
  };

  return (
    <>
      <HeaderPakeRika setcarrito={toggleCarrito} />
      <div className="App">
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center", // Centra verticalmente
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "40px",
              textAlign: "center",
              fontWeight: "bold",
              color: "#333",
              margin: "0 10px", // Espaciado entre imagen y texto
              userSelect: "none"
            }}
          >
            Frutas
          </p>
        </div>

        <div
          className={carritoVisible ? "grid-container" : "grid-containerFull"}
        >
          {Artiuclos.filter((Artiuclo) => Artiuclo.Categoria === "Fruta")
            .sort((a, b) => a.Numero - b.Numero)
            .map((Artiuclo) => (
              <div
                className={`card ${
                  highlightedId === Artiuclo._id && "highlight"
                } ${highlightedIdR === Artiuclo._id && "highlightR"}`}
                key={Artiuclo._id}
              >
                {getCantidad(Artiuclo._id) > 0 && (
                  <>
                    <img
                      className="remove-btn"
                      src="./borrar-removebg.png"
                      alt="Eliminar"
                      style={{ userSelect: "none" }}
                      onClick={() => removeEmpanada(Artiuclo)}
                    />
                    <div
                      className="quantity-badge"
                      style={{ userSelect: "none" }}
                    >
                      {getCantidad(Artiuclo._id)}
                    </div>
                  </>
                )}
                <div
                  style={{ padding: "5px" }}
                  className="cartaAdd"
                  onClick={() => addArticulo(Artiuclo)}
                >
                  <h2>{Artiuclo.Nombre}</h2>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center", // Centra verticalmente
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "40px",
            textAlign: "center",
            marginLeft: "150px",
            fontWeight: "bold",
            color: "#333",
            margin: "0 10px", // Espaciado entre imagen y texto
            userSelect: "none"
          }}
        >
          Verduras
        </p>
      </div>
      <div className={carritoVisible ? "grid-container" : "grid-containerFull"}>
        {Artiuclos.map(
          (Artiuclo) =>
            Artiuclo.Categoria === "Verdura" && (
              <div
                className={`card ${
                  highlightedId === Artiuclo._id && "highlight"
                } ${highlightedIdR === Artiuclo._id && "highlightR"}`}
                key={Artiuclo._id}
              >
                {getCantidad(Artiuclo._id) > 0 && (
                  <>
                    <img
                      className="remove-btn"
                      src="./borrar-removebg.png"
                      alt="Eliminar"
                      style={{ userSelect: "none" }}
                      onClick={() => removeEmpanada(Artiuclo)}
                    />
                    <div
                      className="quantity-badge"
                      style={{ userSelect: "none" }}
                    >
                      {getCantidad(Artiuclo._id)}
                    </div>
                  </>
                )}
                <div className="cartaAdd" onClick={() => addArticulo(Artiuclo)}>
                  <h2>{Artiuclo.Nombre}</h2>
                </div>
              </div>
            )
        )}
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center", // Centra verticalmente
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "40px",
            textAlign: "center",
            marginLeft: "150px",
            fontWeight: "bold",
            color: "#333",
            margin: "0 10px", // Espaciado entre imagen y texto
            userSelect: "none"
          }}
        >
         Limpieza
        </p>
      </div>
      <div className={carritoVisible ? "grid-container" : "grid-containerFull"}>
        {Artiuclos.map(
          (Artiuclo) =>
            (Artiuclo.Categoria === "Limpieza") && (
              <div
                className={`card ${
                  highlightedId === Artiuclo._id && "highlight"
                } ${highlightedIdR === Artiuclo._id && "highlightR"}`}
                key={Artiuclo._id}
              >
                {getCantidad(Artiuclo._id) > 0 && (
                  <>
                    <img
                      className="remove-btn"
                      src="./borrar-removebg.png"
                      alt="Eliminar"
                      style={{ userSelect: "none" }}
                      onClick={() => removeEmpanada(Artiuclo)}
                    />
                    <div
                      className="quantity-badge"
                      style={{ userSelect: "none" }}
                    >
                      {getCantidad(Artiuclo._id)}
                    </div>
                  </>
                )}
                <div className="cartaAdd" onClick={() => addArticulo(Artiuclo)}>
                  <h2>{Artiuclo.Nombre}</h2>
                </div>
              </div>
            )
        )}
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center", // Centra verticalmente
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "40px",
            textAlign: "center",
            marginLeft: "150px",
            fontWeight: "bold",
            color: "#333",
            userSelect: "none",
            margin: "0 10px", // Espaciado entre imagen y texto
          }}
        >
          Bebidas
        </p>
      </div>
      <div className={carritoVisible ? "grid-container" : "grid-containerFull"}>
        {Artiuclos.map(
          (Artiuclo) =>
            (Artiuclo.Categoria === "Bebidas" || Artiuclo.Categoria === "BebidaNPromo" ||
              Artiuclo.Categoria === "Agua") && (
              <div
                className={`card ${
                  highlightedId === Artiuclo._id && "highlight"
                } ${highlightedIdR === Artiuclo._id && "highlightR"}`}
                key={Artiuclo._id}
              >
                {getCantidad(Artiuclo._id) > 0 && (
                  <>
                    <img
                      className="remove-btn"
                      src="./borrar-removebg.png"
                      alt="Eliminar"
                      style={{ userSelect: "none" }}
                      onClick={() => removeEmpanada(Artiuclo)}
                    />
                    <div
                      className="quantity-badge"
                      style={{ userSelect: "none" }}
                    >
                      {getCantidad(Artiuclo._id)}
                    </div>
                  </>
                )}
                <div className="cartaAdd" onClick={() => addArticulo(Artiuclo)}>
                  <h2>{Artiuclo.Nombre}</h2>
                </div>
              </div>
            )
        )}
      </div>
      {carritoVisible && (
        <div className="carritoDiv">
          <Carrito />
        </div>
      )}
    </>
  );
};
