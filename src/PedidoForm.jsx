import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateField, selectDirecc } from './Features/DireccionSlice';

export default function PedidoForm({ setDirecciones ,setDireccSelecc}) {
  const dispatch = useDispatch();
  const formData = useSelector(selectDirecc);
  const callePrincipalRef = useRef(null); // Referencia para el input de Calle Principal

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateField({ name, value }));
  };

  const barrios = [
    "Centro", "Ciudad Vieja", "Pocitos", "Malvín", "Carrasco", "Cordón",
    "Palermo", "La Blanqueada", "Aguada", "Buceo", "Parque Rodó"
  ];

  useEffect(() => {
    if (window.google && callePrincipalRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(callePrincipalRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'UY' } // Restringir a Uruguay (UY)
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.address_components) {
          let callePrincipal = '';
          let numeroPuerta = '';
          let esquina1 = '';
          let esquina2 = '';
          let apto = '';

          // Obtener componentes de dirección específicos
          place.address_components.forEach((component) => {
            const types = component.types;
            if (types.includes("route")) {
              callePrincipal = component.long_name; // Calle principal
            }
            if (types.includes("street_number")) {
              numeroPuerta = component.long_name; // Número de puerta
            }
            if (types.includes("intersection")) {
              if (!esquina1) {
                esquina1 = component.long_name; // Primera esquina
              } else {
                esquina2 = component.long_name; // Segunda esquina
              }
            }
            if (types.includes("subpremise")) {
              apto = component.long_name; // Apartamento o piso
            }
          });

          // Actualizar los campos del formulario con los datos obtenidos
          dispatch(updateField({ name: 'CallePrincipal', value: callePrincipal }));
          dispatch(updateField({ name: 'NumeroPuerta', value: numeroPuerta }));
          dispatch(updateField({ name: 'Esquina1', value: esquina1 }));
          dispatch(updateField({ name: 'Esquina2', value: esquina2 }));
          dispatch(updateField({ name: 'Apto', value: apto }));
        }
      });
    }
  }, [dispatch]);

  const AddDirec = () => {
    const existingDirecciones = JSON.parse(localStorage.getItem('Direcciones')) || [];

    if (!formData.id) {
      const lastId = existingDirecciones.length > 0 ? existingDirecciones[existingDirecciones.length - 1].id : 0;
      const newFormData = { ...formData, id: lastId + 1 };
      const updatedDirecciones = [...existingDirecciones, newFormData];
      localStorage.setItem('Direcciones', JSON.stringify(updatedDirecciones));
    } else {
      const updatedDirecciones = existingDirecciones.map((direccion) =>
        direccion.id === formData.id ? { ...formData } : direccion
      );
      localStorage.setItem('Direcciones', JSON.stringify(updatedDirecciones));
    }

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
      <h2 className="pedido-form__title" style={{userSelect: "none" }}>Nueva Direccion</h2>
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
          <input
            type="text"
            id="CallePrincipal"
            name="CallePrincipal"
            value={formData.CallePrincipal}
            onChange={handleChange}
            required
            className="pedido-form__input"
            placeholder="Ingresa tu dirección"
            ref={callePrincipalRef} // Agregar la referencia para el autocompletado
          />
        </div>
        {formData.CallePrincipal}
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
            <input type="number" id="Apto" name="Apto" value={formData.Apto} onChange={handleChange} className="pedido-form__input" placeholder="Apartamento" />
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
