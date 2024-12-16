import React, { useState, useEffect } from 'react'
import { HeaderPakeRika } from './HeaderPakeRika'

export const Extras = () => {
  const [Ref, setRef] = useState("")
  const [Monto, setMonto] = useState("")
  const [extras, setExtras] = useState([])

  const [User, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const getLocalISOString = (date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };
  const [Fecha, setFecha] = useState(getLocalISOString(new Date()))

  const addExtra = async () => {
    const extra = {
        Referencia: Ref,
        Monto: Monto,
        Usuario: User,
        Fecha: Fecha
    }
    try {
        const response = await fetch(`http://localhost:3019/SaveExtra`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(extra)
        });
        const data = await response.json();

        if(data){
            fetchExtras(); // Refresh the list after adding
            // Reset form fields
            setRef("");
            setMonto("");
            setFecha(getLocalISOString(new Date()));
        }
      } catch (error) {
        console.error("Error saving extra:", error);
      }
  }

  const fetchExtras = async () => {
    try {
      const response = await fetch(`http://localhost:3019/getExtras`);
      const data = await response.json();
      setExtras(data);
    } catch (error) {
      console.error("Error fetching extras:", error);
    }
  };

  useEffect(() => {
    fetchExtras();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault()
    addExtra();
  }

  return (
    <>
    <HeaderPakeRika/>
    <div 
      style={{
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '20px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginTop:"80px"
      }}
    >
      <h2 
        style={{
          fontSize: '1.5rem', 
          marginBottom: '20px', 
          fontWeight: 'bold'
        }}
      >
        Extras
      </h2>
      <form 
        onSubmit={handleSubmit} 
        style={{
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr auto', 
          gap: '15px', 
          alignItems: 'end',
          marginBottom: '20px'
        }}
      >
        <div>
          <label 
            htmlFor="ref" 
            style={{
              display: 'block', 
              marginBottom: '5px',
              fontWeight: '500'
            }}
          >
            Referencia
          </label>
          <input
            id="ref"
            type="text"
            value={Ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="Ingrese referencia"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <div>
          <label 
            htmlFor="monto" 
            style={{
              display: 'block', 
              marginBottom: '5px',
              fontWeight: '500'
            }}
          >
            Monto
          </label>
          <input
            id="monto"
            type="number"
            value={Monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="Ingrese monto"
            step="0.01"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <div>
          <label 
            htmlFor="fecha" 
            style={{
              display: 'block', 
              marginBottom: '5px',
              fontWeight: '500'
            }}
          >
            Fecha
          </label>
          <input
            id="fecha"
            type="date"
            value={Fecha instanceof Date ? Fecha.toISOString().split('T')[0] : Fecha}
            onChange={(e) => setFecha(new Date(e.target.value))}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          Guardar
        </button>
      </form>

      {/* Extras List */}
      <div>
        <h3 
          style={{
            fontSize: '1.25rem', 
            marginBottom: '15px', 
            fontWeight: 'bold'
          }}
        >
          Lista de Extras
        </h3>
        <table 
          style={{
            width: '100%', 
            borderCollapse: 'collapse',
            border: '1px solid #e0e0e0'
          }}
        >
          <thead>
            <tr 
              style={{
                backgroundColor: '#f0f0f0',
                borderBottom: '1px solid #ddd'
              }}
            >
              <th style={{ padding: '10px', textAlign: 'left' }}>Referencia</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Monto</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {extras.map((extra, index) => (
              <tr 
                key={extra._id || index}
                style={{
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9'
                }}
              >
                <td style={{ padding: '10px' }}>{extra.Referencia}</td>
                <td style={{ padding: '10px' }}>{extra.Monto}</td>
                <td style={{ padding: '10px' }}>
                  {new Date(extra.Fecha).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  )
}

export default Extras