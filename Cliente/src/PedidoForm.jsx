import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateField, selectDirecc } from './Features/DireccionSlice';
import './pedidoForm.css';

export default function PedidoForm({ setDirecciones }) {
  const dispatch = useDispatch();
  const formData = useSelector(selectDirecc);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateField({ name, value }));
  };

  const barrios = [
    "Centro", "Ciudad Vieja", "Pocitos", "Malvín", "Carrasco", "Cordón",
    "Palermo", "La Blanqueada", "Aguada", "Buceo", "Parque Rodó"
  ];

  const AddDirec=()=>{
    // Obtener las direcciones existentes o un array vacío si no existen
    const existingDirecciones = JSON.parse(localStorage.getItem('Direcciones')) || [];
  
    // Obtener el último ID de la lista, si la lista está vacía asignar el ID como 1
    const lastId = existingDirecciones.length > 0
      ? existingDirecciones[existingDirecciones.length - 1].id
      : 0;
  
    // Asignar un nuevo ID al formData
    const newFormData = {
      ...formData,
      id: lastId + 1
    };
  
    // Actualizar la lista de direcciones
    const updatedDirecciones = [...existingDirecciones, newFormData];
  
    // Guardar la lista actualizada en localStorage
    localStorage.setItem('Direcciones', JSON.stringify(updatedDirecciones));
    
    // Resetear el formulario o el estado relacionado
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
  };
  

  return (
    <div className="pedido-form">
      <h2 className="pedido-form__title">Datos Pedido</h2>
      <form className="pedido-form__form">
        <div className="pedido-form__field">
          <label htmlFor="Barrio" className="pedido-form__label">Barrio</label>
          <select id="Barrio" name="Barrio" className="pedido-form__input2" value={formData.Barrio} onChange={handleChange}>
            <option value=""></option>
            {barrios.map((barrio, index) => (
              <option key={index} value={barrio}>{barrio}</option>
            ))}
          </select>
        </div>

        <div className="pedido-form__field">
          <label htmlFor="CallePrincipal" className="pedido-form__label">Calle Principal</label>
          <input type="text" id="CallePrincipal" name="CallePrincipal" value={formData.CallePrincipal} onChange={handleChange} required className="pedido-form__input" placeholder="Ingresa tu dirección" />
        </div>

        <div className="pedido-form__row">
          <div className="pedido-form__field2">
            <label htmlFor="Esquina1" className="pedido-form__label">Esquina 1</label>
            <input type="text" id="Esquina1" name="Esquina1" value={formData.Esquina1} onChange={handleChange} required className="pedido-form__input2" placeholder="Esquina 1" />
          </div>

          <div className="pedido-form__field2">
            <label htmlFor="Esquina2" className="pedido-form__label">Esquina 2</label>
            <input type="text" id="Esquina2" name="Esquina2" value={formData.Esquina2} onChange={handleChange} required className="pedido-form__input2" placeholder="Esquina 2" />
          </div>
        </div>

        <div className="pedido-form__row">
          <div className="pedido-form__field2">
            <label htmlFor="NumeroPuerta" className="pedido-form__label">Número de puerta</label>
            <input type="number" id="NumeroPuerta" name="NumeroPuerta" value={formData.NumeroPuerta} onChange={handleChange} required className="pedido-form__input" placeholder="Número de puerta" />
          </div>

          <div className="pedido-form__field2">
            <label htmlFor="Apto" className="pedido-form__label">Apartamento</label>
            <input type="number" id="Apto" name="Apto" value={formData.Apto} onChange={handleChange} required className="pedido-form__input" placeholder="Apartamento" />
          </div>
        </div>

        <div className="pedido-form__buttons">
          <button onClick={() => setDirecciones()} className="pedido-form__button pedido-form__button--cancel">Cancelar</button>
          <button onClick={AddDirec} className="pedido-form__button pedido-form__button--confirm">Confirmar dirección</button>
        </div>
      </form>
    </div>
  );
}
