import React, { useState, useEffect } from 'react';
import { HeaderPakeRika } from './HeaderPakeRika';

export const Ordenes = () => {
    const [ordenes, setOrdenes] = useState([]);
    const port = 3079;

    useEffect(() => {
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

        fetchOrdenes();
    }, []);

    return (
        <div style={{ margin: '20px' }}>
            <HeaderPakeRika/>
            <h1 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Lista de Órdenes</h1>
            {ordenes.slice().reverse().map((orden) => ( 
                <div key={orden._id} style={{ border: '1px solid #ddd', marginBottom: '10px', padding: '10px', borderRadius: '5px' }}>
                    <div style={{ marginBottom: '10px', fontSize: '0.9rem' }}>
                        <strong>Fecha:</strong> {new Date(orden.Dia).toLocaleDateString()} <br />
                        <strong>Hora:</strong> {orden.Hora} <br />
                        <strong>Pago:</strong> {orden.Pago} <br />
                        <strong>Total:</strong> ${orden.Total}
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr>
                                <th style={{ borderBottom: '1px solid #ddd', padding: '6px', textAlign: 'left' }}>Nombre</th>
                                <th style={{ borderBottom: '1px solid #ddd', padding: '6px', textAlign: 'left' }}>Categoría</th>
                                <th style={{ borderBottom: '1px solid #ddd', padding: '6px', textAlign: 'left' }}>Precio</th>
                                <th style={{ borderBottom: '1px solid #ddd', padding: '6px', textAlign: 'left' }}>Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orden.Articulos.map((articulo, index) => (
                                <tr key={index}>
                                    <td style={{ borderBottom: '1px solid #ddd', padding: '6px' }}>{articulo.Nombre}</td>
                                    <td style={{ borderBottom: '1px solid #ddd', padding: '6px' }}>{articulo.Categoria}</td>
                                    <td style={{ borderBottom: '1px solid #ddd', padding: '6px' }}>${articulo.Precio}</td>
                                    <td style={{ borderBottom: '1px solid #ddd', padding: '6px' }}>{articulo.cantidad}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};
