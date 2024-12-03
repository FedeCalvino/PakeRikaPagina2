import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PedidoForm from "./PedidoForm";
import "./CheckOut.css"; // Importa el archivo CSS
import { setDirecc } from './Features/DireccionSlice';
import { HeaderPakeRika } from './HeaderPakeRika';
import { updateField, selectDirecc } from './Features/DireccionSlice';
import { Direcciones } from "./Direcciones";
export const CheckOut = () => {
  const navigate = useNavigate();
  const [Pedido, setPedido] = useState({
    telefono: '',
    metodoPago: 'efectivo',
    comentarios: '',
    Monto:""
  })
  const formData = useSelector(selectDirecc); 
  const [AgergarDirecc,setAgergarDirecc] = useState(false)
  const position = localStorage.getItem("position");
  const positionParse = position ? JSON.parse(position) : null;
  const dispatch = useDispatch();
  const carritoRedux = useSelector((state) => state.Carrito);
  const carritoLocalStorage = localStorage.getItem("carrito");

  const carrito = carritoRedux.prods
    ? carritoRedux
    : JSON.parse(carritoLocalStorage);

  const handleChange =(e)=>{
    const {name,value} = e.target
    setPedido((prevPedido) =>
    ({
      ...prevPedido,
      [name]:value
    })
    )
  }


  useEffect(()=>{
    const storedData = localStorage.getItem('direcciones');
    const DireccData = storedData ? JSON.parse(storedData) : null;

    if(DireccData){
      dispatch(setDirecc(DireccData))
    }

  },[])
const AgergarNewDirecc=()=>{
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
  setAgergarDirecc(true)
}
  const imgCarga = () => {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <img className="h-96" src="pakerikalogo-remove.png" alt="Logo" />
      </div>
    );
  };

  if (!positionParse) {
    // return <imgCarga />;
  }
  const setDirecciones =()=>{
    setAgergarDirecc(false)
  }

  const EditDirecc =(direcc)=>{
    setAgergarDirecc(true)
  }

  return (
    <div className="check-out-container">
      <HeaderPakeRika />
      <div className="cart-container">
        <div className="compras">
          <h3 className="cart-title" style={{userSelect: "none" }}>Carrito de Compras</h3>
          <ul className="divide-y divide-gray-200">
            {carrito.Carrito.prods.map((producto) => (
              <li key={producto._id} className="cart-item">
                <p className="cart-item-name">{producto.nombre}</p>
                <p className="cart-item-info">Cantidad: {producto.cantidad}</p>
                <p className="cart-item-price">${producto.cantidad*producto.Precio}</p>
              </li>
            ))}
          </ul>
          <div className="cart-total" style={{userSelect: "none" }}>
            <h4>Total: ${carrito.Carrito.total}</h4>
          </div>
        </div>
        <div className="pedido-form-container">
          { AgergarDirecc ? 
          <>
          <PedidoForm setDirecciones={setDirecciones}/>
          </>   
          :
          <>
            <Direcciones callBackEdit={EditDirecc}/>
            <div style={{display:"flex",justifyContent:"center"}}>
            <button onClick={()=>AgergarNewDirecc()} className="pedido-form__submit">
              Agregar Direccion
            </button>
            </div>
          </>
          }
        </div>
      </div>
      <div className="pedido-form__field">
      <div className="address-container">
        <p className="address-label">
          Dirección:{" "}
          <span className="address-value">
            { formData.CallePrincipal ?
              <span>
                {`${formData.CallePrincipal} ${formData.NumeroPuerta}, ${formData.Barrio}`}
              </span> 
              :
              "Sin Seleccionar"
            }
          </span>
        </p>
      </div>
      <div>
  <label htmlFor="telefono" className="pedido-form__label">
    Teléfono
  </label>
  <input
    type="number"
    id="telefono"
    name="telefono"
    value={Pedido.telefono}
    onChange={handleChange}
    required
    className="pedido-form__input"
    placeholder="Teléfono"
  />
</div>
        </div>
        <div className="pedido-form__field">
          <span className="pedido-form__label">Método de pago</span>
          <div className="pedido-form__radio-group">
            {['Efectivo', 'Tarjeta'].map((method) => (
              <label key={method} className="pedido-form__radio-label">
                <input
                  type="radio"
                  name="metodoPago"
                  value={method}
                  checked={Pedido.metodoPago === method}
                  onChange={handleChange}
                  className="pedido-form__radio"
                />
                <span className="pedido-form__radio-text">{method}</span>
              </label>
            ))}
          </div>
        </div>
        {
          Pedido.metodoPago === "Efectivo" && 
          <>
          <label className="pedido-form__label">
            Monto
          </label>
          <input
          style={{width:"130px"}}
            type="number"
            id="Monto"
            name="Monto"
            value={Pedido.Monto}
            onChange={handleChange}
            required
            className="pedido-form__input"
            placeholder="Monto"
          />
          </>
        }
        <div className="pedido-form__field">
          <label htmlFor="comentarios" className="pedido-form__label">
            Comentarios adicionales
          </label>
          <input
            style={{width:"130px"}}
            type="text"
            id="comentarios"
            name="comentarios"
            value={Pedido.comentarios}
            onChange={handleChange}
            required
            className="pedido-form__textarea"
            placeholder="Escribe algún comentario (opcional)"
          />
        </div>

        <div className="pedido-form__field">
          <button type="submit" className="pedido-form__submit">
            Hacer Pedido
          </button>
        </div>
    </div>
  );
};
