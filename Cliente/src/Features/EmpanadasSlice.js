import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Empanadas: []
};

export const EmpanadasSlice = createSlice({
    name: "Empanadas", // Cambia el nombre aquí
    initialState,
    reducers: {
        setEmpanadas: (state, action) => {
            state.Empanadas = action.payload;
            console.log("Empanadas cargadas");
        }
    }
});

export const { setEmpanadas } = EmpanadasSlice.actions;

export const selectEmpanadas = (state) => state.Empanadas.Empanadas; // Ajusta aquí

export default EmpanadasSlice.reducer;
