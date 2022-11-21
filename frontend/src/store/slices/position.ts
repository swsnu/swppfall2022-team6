import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "..";

export interface PositionType {
  lat: number;
  lng: number;
};

export interface PositionState { position: PositionType;}
const initialState: PositionState = {
  position: {
    lat: 37.44877599087201,
    lng: 126.95264777802309,
  }
}; 

export const positionSlice = createSlice({
  name: "position",
  initialState,
  reducers: {
    setPosition: (state, action: PayloadAction<PositionType>) => {
      const newPosition = {...action.payload};
      state.position = newPosition;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setPosition.fulfilled, (state, action) => {
      state.position = action.payload;
    });
  }
});

export const setPosition = createAsyncThunk(
  "position/setPosition", 
  async (data: PositionType, {dispatch}) => {
    dispatch(positionActions.setPosition(data))
    return data;
  }
);


export const positionActions = positionSlice.actions;
export const selectPosition = (state: RootState) => state.positions;
export default positionSlice.reducer;