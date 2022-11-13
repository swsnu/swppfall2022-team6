import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "..";

export interface PositionType {
  lat: number;
  lng: number;
};

export interface PositionState { position: PositionType;}
const initialState: PositionState = {
  position: {lat: 37.0, lng: 127.0}
}; 

export const positionSlice = createSlice({
  name: "position",
  initialState,
  reducers: {
    editPosition: (state, action: PayloadAction<{ position: PositionType }>) => {
      const newPosition = {...action.payload.position};
      state.position = newPosition;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(editPosition.fulfilled, (state, action) => {
      state.position = action.payload;
    });
  }
});

export const editPosition = createAsyncThunk(
  "position/fetchPosition", 
  async (data: PositionType) => {
    return data;
  }
);


export const positionActions = positionSlice.actions;
export const selectPosition = (state: RootState) => state.positions;
export default positionSlice.reducer;