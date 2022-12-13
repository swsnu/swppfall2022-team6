import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "..";

export interface PositionType {
  lat: number;
  lng: number;
};

export interface PositionState { 
  findPosition: PositionType;
  currPosition: PositionType;
}
const initialState: PositionState = {
  findPosition: {
    lat: 37.44877599087201,
    lng: 126.95264777802309,
  },
  currPosition: {
    lat: 37.44877599087201,
    lng: 126.95264777802309,
  }
}; 

export const positionSlice = createSlice({
  name: "position",
  initialState,
  reducers: {
    setFindPosition: (state, action: PayloadAction<PositionType>) => {
      const newPosition = {...action.payload};
      state.findPosition = newPosition;
    },
    setCurrPosition: (state, action: PayloadAction<PositionType>) => {
      const newPosition = {...action.payload};
      state.currPosition = newPosition;
    },
  },
});

export const setFindPosition = createAsyncThunk(
  "position/setFindPosition", 
  async (data: PositionType, {dispatch}) => {
    dispatch(positionActions.setFindPosition(data))
    return data;
  }
);
export const setCurrPosition = createAsyncThunk(
  "position/setCurrPosition", 
  async (data: PositionType, {dispatch}) => {
    dispatch(positionActions.setCurrPosition(data))
    return data;
  }
);


export const positionActions = positionSlice.actions;
export const selectPosition = (state: RootState) => state.positions;
export default positionSlice.reducer;