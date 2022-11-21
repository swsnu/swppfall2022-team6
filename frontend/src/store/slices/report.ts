import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "..";
import axios from 'axios';

export interface ReportType {
  id: number;
  user_name: string;
  weather: string;
  weather_degree: number;
  wind_degree: number;
  happy_degree: number;
  humidity_degree: number;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface ReportState { reports: ReportType[];}
const initialState: ReportState = {
  reports: [],
}; 

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    addReport: (state, action: PayloadAction<ReportType>) => {
      const newReport = {...action.payload};
      state.reports.push(newReport);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchReports.fulfilled, (state, action) => {
      state.reports = action.payload;
    });
    builder.addCase(addReport.rejected, (_state, action) =>{
      console.error(action.error); // addReport.pending 이면 로딩 중에 다른 작업 가능
    });
  }
});

export const fetchReports = createAsyncThunk(
  "report/fetchReports", 
  async (data: {lat:number, lng:number, radius:number}) => {
    const {lat, lng, radius} = data;
    const response = await axios.get<ReportType[]>("/report/", {
      params: { latitude: lat, longitude: lng, radius: radius }
    });
    return response.data;
  }
);

export const addReport = createAsyncThunk(
  "report/addReport",
  async(data:ReportType, {dispatch}) => {
    const response = await axios.post<ReportType>("/report/", data);
    dispatch(reportActions.addReport(response.data))
    return response.data;
  }
);

export const reportActions = reportSlice.actions;
export const selectReport = (state: RootState) => state.reports;
export default reportSlice.reducer;