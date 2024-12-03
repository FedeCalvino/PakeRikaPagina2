import { configureStore } from "@reduxjs/toolkit";
import ArticulosSlice from "./Features/ArticulosSlice";
import CarritoSlice from "./Features/CarritoSlice";
import PositionSlice from "./Features/PositionSlice";
import DireccionSlice from "./Features/DireccionSlice";
export const store = configureStore({
    reducer: {
        Articulos: ArticulosSlice, 
        Carrito: CarritoSlice,
        Position: PositionSlice,
        Direcc:DireccionSlice
    }
});
