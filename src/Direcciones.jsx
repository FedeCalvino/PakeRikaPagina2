import React, { useState, useEffect } from "react";
import './Direcc.css'
import { useDispatch } from "react-redux";
import {setDirecc} from "./Features/DireccionSlice"
export const Direcciones = ({callBackEdit}) => {
  // Agregar estado para las direcciones
  const [direcciones, setDirecciones] = useState(JSON.parse(localStorage.getItem('Direcciones')) || []);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const dispatch = useDispatch()

  // Manejar la selección de una dirección
  const handleSelectDireccion = (direccion) => {
    setDireccionSeleccionada(direccion);
    dispatch(setDirecc(direccion))
  };
  const handleEdit = (direccion)=>{
    callBackEdit(direccion)
  }

  // Manejar el borrado de una dirección utilizando propiedades únicas
  const handleDeleteDireccion = (direccionToDelete) => {
    const existingDirecciones = JSON.parse(localStorage.getItem('Direcciones')) || [];

    const updatedDirecciones = existingDirecciones.filter(
      (direccion) =>
        direccion.id !== direccionToDelete.id
    );

    // Actualizar localStorage
    localStorage.setItem("Direcciones", JSON.stringify(updatedDirecciones));

    // Actualizar el estado de direcciones
    setDirecciones(updatedDirecciones);

    // Limpiar la dirección seleccionada si fue borrada
    if (direccionSeleccionada === direccionToDelete) {
      setDireccionSeleccionada(null);
      
      dispatch(setDirecc({
        Direcc: {
          CallePrincipal: '',
          NumeroPuerta: '',
          Apto: '',
          Esquina1: '',
          Esquina2: '',
          Barrio: ''
        },
        str: ''
      }));
    }
  };

  return (
    <div>
      <h2 style={{userSelect: "none" }}>Seleccione una Dirección</h2>
      {direcciones.length === 0 ? (
        <p>No hay direcciones guardadas.</p>
      ) : (
        <ul>
          {direcciones.map((direccion, index) => (
            <li
              className={`direcc ${direccionSeleccionada ? (direccionSeleccionada.id === direccion.id ? "Selecc" : "") : ""}`}
              key={index}
              onClick={() => handleSelectDireccion(direccion)}
              style={{
                cursor: "pointer",
                padding: "10px",
                borderBottom: "1px solid #ccc",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                {`${direccion.CallePrincipal} ${direccion.NumeroPuerta}, ${direccion.Barrio}`}
              </span>
              <span
                onClick={() => handleEdit(direccion)}
                style={{
                  cursor: "pointer",
                  color: "blue",
                  marginLeft: "10px",
                }}
              >
                Editar
              </span>
              <span
                onClick={() => handleDeleteDireccion(direccion)}
                style={{
                  cursor: "pointer",
                  color: "red",
                  marginLeft: "10px",
                }}
              >
                ❌
              </span>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
};
