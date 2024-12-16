import React, { useState } from 'react';
import { Catalogo } from './Catalogo';
import { store } from './Store';
import { Provider } from 'react-redux';
import { Carrito } from './Carrito';
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { CheckOut } from "./CheckOut";
import { Ordenes } from './Ordenes';
import ManejoStock from './ManejoStock';
import { Datos } from './Datos';
import { Login } from './Login';
import { ProtectedRoute } from './ProtectedRoute';
import Extras from './Extras';
import { Locales } from './Locales';

function App() {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState(false);
    const [User, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [Local, setLocal] = useState(() => {
        const storedLocal = sessionStorage.getItem('local');
        return storedLocal ? JSON.parse(storedLocal) : null;
    });

    function capitalizeFirstLetter(string) {
        if (!string) return ""; 
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const login = async (contrasena) => {
        try {
            const url = `http://localhost:3020/usuarios`;
            const contra = capitalizeFirstLetter(contrasena);
            const response = await fetch(url);
            const result = await response.json();
            
            let oka = false;
            let usuario = null;
            
            result.forEach(user => {
                if (user.Nombre === contra) {
                    oka = true;
                    usuario = user;
                }
            });

            if (!oka) {
                return oka;
            } else {
                sessionStorage.setItem('user', JSON.stringify(usuario));
                setUser(usuario);
                setLoginError(false);
                navigate("/CatologoP");
            }
        } catch (error) {
            console.error('Error:', error);
            setLoginError(true); 
        }
    };

    const setLocales = (local) => {
        sessionStorage.setItem('local', JSON.stringify(local));
        setLocal(local);
        navigate("/CatologoP");
    };

    return (
        <Routes>
            <Route path='/' element={<Locales setLocal={setLocales}/>}/>
            <Route path='/otro' element={
                <ProtectedRoute user={User} login={login}>
                    <Catalogo/>
                </ProtectedRoute>
            }/>
            <Route path="/CatologoP" element={<Catalogo/>}/>
            <Route path="/CheckOutP" element={<CheckOut/>}/>
            <Route path="/OrdenesP" element={<Ordenes/>}/>
            <Route path="/StockP" element={<ManejoStock/>}/>
            <Route path="/Cierre" element={<Datos/>}/>
            <Route path="/Extra" element={<Extras/>}/>
        </Routes>
    );
}

export default function AppWrapper() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    );
}