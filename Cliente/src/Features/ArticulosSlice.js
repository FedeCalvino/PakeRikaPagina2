import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Articulos: []
};

export const ArticulosSlice = createSlice({
    name: "Articulos", // Cambia el nombre aquí
    initialState,
    reducers: {
        setArticulos: (state, action) => {
            state.Articulos = action.payload;
        }
    }
});

export const { setArticulos } = ArticulosSlice.actions;

export const selectArticulos = (state) => state.Articulos.Articulos; // Ajusta aquí

export default ArticulosSlice.reducer;
