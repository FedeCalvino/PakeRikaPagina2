import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Position: []
};

export const PositionSlice = createSlice({
    name: "Position", 
    initialState,
    reducers: {
        setPosition: (state, action) => {
            state.Position = action.payload;
            console.log("Position");
        }
    }
});

export const { setPosition } = PositionSlice.actions;

export const selectPosition = (state) => state.Position.Position;

export default PositionSlice.reducer;
