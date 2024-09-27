import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Direcc: {
        CallePrincipal: '',
        NumeroPuerta: "",
        Apto: "",
        Esquina1: "",
        Esquina2: "",
        Barrio: "",
        id:0
    },
    str:""
};

export const DireccionSlice = createSlice({
    name: "Direcc", // Nombre del slice
    initialState,
    reducers: {
        setDirecc: (state, action) => {
            // Aquí actualizamos la dirección completa
            state.Direcc = action.payload;
            console.log("Dirección actualizada:", state.Direcc);
        },
        updateField: (state, action) => {
            // Aquí actualizamos solo un campo específico
            const { name, value } = action.payload;
            console.log(name,value)
            state.Direcc[name] = value;
            console.log(state.Direcc[name])
        }
    }
});

export const { setDirecc, updateField } = DireccionSlice.actions;

export const selectDirecc = (state) => state.Direcc.Direcc; // Selector del estado

export default DireccionSlice.reducer;
