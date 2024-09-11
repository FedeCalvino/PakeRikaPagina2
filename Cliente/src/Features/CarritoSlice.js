import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Carrito: { prods: [], total: 0 }
};

export const CarritoSlice = createSlice({
    name: "Carrito",
    initialState,
    reducers: {
        setCarritoSlice: (state, action) => {
            console.log("action.payload",action.payload.Carrito)
            state.Carrito = action.payload.Carrito;
            console.log("Carrito cargado");
        },
        clearCarritoSlice: (state) => {
            state.Carrito = { prods: [], total: 0 };
            console.log("Carrito borrado");
        },
        updateProducto: (state, action) => {
            console.log("state.Carrito",state.Carrito.Carrito)
            const { empanada, quantityChange } = action.payload;
            const foundEmpanada = state.Carrito.prods ? state.Carrito.prods.find(item => item._id === empanada._id) : null;
            if (foundEmpanada) {
                foundEmpanada.cantidad += quantityChange;
                if (foundEmpanada.cantidad <= 0) {
                    state.Carrito.prods = state.Carrito.prods.filter(item => item._id !== empanada._id);
                }
            } else if (quantityChange > 0) {
                state.Carrito.prods.push({ ...empanada, cantidad: quantityChange });
            }
        
            console.log('Productos en el carrito:', state.Carrito.prods);
        },
        updateTotal: (state, action) => {
            const { empanada, quantityChange } = action.payload;
            const precio = parseFloat(empanada.Precio);
            state.Carrito.total += precio * quantityChange;
            console.log('Total actualizado:', state.Carrito.total);
        },        
    }
});

export const { setCarritoSlice, clearCarritoSlice, updateProducto, updateTotal } = CarritoSlice.actions;

export default CarritoSlice.reducer;
