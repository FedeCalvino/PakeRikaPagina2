import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSelector } from 'react-redux';
import{useEffect } from 'react';

export const CheckOut = () => {

  const position = useSelector((state) => state.Position);
  const carrito = useSelector((state) => state.Carrito);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, []);

  console.log("carrito checkout",carrito)
  // Verifica si la posición está disponible
  if (!position || !position.Position || !position.Position.length) {
    return <p>Cargando ubicación...</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      {/* Mapa */}
      <div style={{ height: '300px', width: '100%', maxWidth: '600px', marginBottom: '20px' }}>
        <MapContainer
          center={position.Position}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position.Position}>
            <Popup>
              Estás aquí.<br /> Ajusta tu ubicación si es necesario.
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Dirección */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <p><strong>Dirección:</strong> {position.Address || 'Dirección no disponible'}</p>
      </div>

      {/* Carrito */}
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <h3>Carrito de Compras</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {carrito.Carrito.prods.map((producto) => (
            <li key={producto._id} style={{ borderBottom: '1px solid #ddd', padding: '1px 0' }}>
              <p><strong>Nombre:</strong> {producto.nombre}</p>
              <p><strong>Ingredientes:</strong> {producto.ingredientes}</p>
              <p><strong>Cantidad:</strong> {producto.cantidad}</p>
              <p><strong>Precio:</strong> ${producto.Precio}</p>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: '10px', textAlign: 'right' }}>
          <h4>Total: ${carrito.Carrito.total}</h4>
        </div>
      </div>
    </div>
  );
};
