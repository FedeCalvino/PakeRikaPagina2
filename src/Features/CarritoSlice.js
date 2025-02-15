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
            const { Prod, quantityChange } = action.payload;
            const foundEmpanada = state.Carrito.prods ? state.Carrito.prods.find(item => item._id === Prod._id) : null;
            if (foundEmpanada) {
                foundEmpanada.cantidad += quantityChange;
                if (foundEmpanada.cantidad <= 0) {
                    state.Carrito.prods = state.Carrito.prods.filter(item => item._id !== Prod._id);
                }
            } else if (quantityChange > 0) {
                state.Carrito.prods.push({ ...Prod, cantidad: quantityChange });
            }
        
            console.log('Productos en el carrito:', state.Carrito.prods);
        },
        updatePeso: (state, action) => {
            console.log("state.Carrito",state.Carrito.Carrito)
            const { Prod, Peso } = action.payload;
            const foundProd = state.Carrito.prods ? state.Carrito.prods.find(item => item._id === Prod._id) : null;
            if (foundProd) {
                foundProd.Peso = Peso;
                foundProd.PrecioPeso = (Peso*foundProd.Precio).toFixed(1);
            }
            console.log('Productos en el carrito:', state.Carrito.prods);
        },
        updateTotal: (state, action) => {
            let Total=0
            state.Carrito.prods.map(((Produc)=>{
                if(Produc.UnidadPeso!=="Peso"){
                    const precio = parseFloat(Produc.Precio);
                    Total += precio * Produc.cantidad;
                }else{
                    const precio = parseFloat(Produc.PrecioPeso);
                    Total += precio;
                }
            }))
            state.Carrito.total = Total;
        },        
    }
});

export const { setCarritoSlice, clearCarritoSlice, updateProducto, updateTotal,updatePeso } = CarritoSlice.actions;

export default CarritoSlice.reducer;
