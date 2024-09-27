import { configureStore } from "@reduxjs/toolkit";
import EmpanadasSlice from "./Features/EmpanadasSlice";
import CarritoSlice from "./Features/CarritoSlice";
import PositionSlice from "./Features/PositionSlice";
import DireccionSlice from "./Features/DireccionSlice";
export const store = configureStore({
    reducer: {
        empanadas: EmpanadasSlice, 
        Carrito: CarritoSlice,
        Position: PositionSlice,
        Direcc:DireccionSlice
    }
});
