import React from 'react';
import { Catalogo } from './Catalogo';
import { store } from './Store'; // Ajuste: la importación debería coincidir con el nombre exportado
import { Provider } from 'react-redux';
import { Carrito } from './Carrito';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {CheckOut} from "./CheckOut"
import { Link } from 'react-router-dom';
import { Ordenes } from './Ordenes';
import ManejoStock from './ManejoStock';

export function App() {
    return (
        <Provider store={store}>
        <BrowserRouter>
        <Routes>
                <Route path="/" element={<Catalogo/>}/>
                <Route path="/CatologoP" element={<Catalogo/>}/>
                <Route path="/CheckOutP" element={<CheckOut/>}/>
                <Route path="/OrdenesP" element={<Ordenes/>}/>
                <Route path="/StockP" element={<ManejoStock/>}/>
        </Routes>   
        </BrowserRouter>
    </Provider>

    );
}
