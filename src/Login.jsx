import React, { useState } from 'react';
import './Login.css'; // Archivo CSS para estilos opcionales

export const Login = ({loginFnct}) => {
  const [local, setLocal] = useState('Rivera');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {

    e.preventDefault();

    const res = await loginFnct(password)

    if (res !== false) {
      setError('');
      alert(`Bienvenido al local de ${local}`);
      // Aquí puedes redirigir a otra página o realizar alguna acción
    } else {
      setError('Contraseña incorrecta.');
    }

  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Selecciona un local:</label>
          <div className="button-group">
            <button
              type="button"
              className={`local-button ${local === 'Rivera' ? 'selected' : ''}`}
              onClick={() => setLocal('Rivera')}
            >
              Rivera
            </button>
            <button
              type="button"
              className={`local-button ${local === 'Colonia' ? 'selected' : ''}`}
              onClick={() => setLocal('Colonia')}
            >
              Colonia
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Nombre</label>
          <input
            type="String"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};