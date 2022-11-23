import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { ThunkMiddleware } from "redux-thunk";
import axios from "axios";
import reducer, { addReport, fetchReports, ReportState } from "./report";

describe("report reducer", () => {
    type NewType = EnhancedStore<
        {
            reports: ReportState;
        },
        AnyAction,
        [
            ThunkMiddleware<
                {
                    reports: ReportState;
                },
                AnyAction,
                undefined
            >
        ]
    >;

    let store: NewType;
    const fakeReport = {
        id: 1,
        user_name: "user1",
        weather: "Sunny",
        weather_degree: 3,
        wind_degree: 2,
        happy_degree: 2,
        humidity_degree: 4,
        latitude: 0,
        longitude: 0,
        created_at: "2022-11-20T8:43:28UTC+9",
    };
    beforeAll(() => {
        store = configureStore({ reducer: { reports: reducer } });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should handle initial state", () => {
        expect(reducer(undefined, { type: "unknown" })).toEqual({
            reports: [],
        });
    });
    it("should handle addReport", async () => {
        axios.post = jest.fn().mockResolvedValue({ data: fakeReport });
        await store.dispatch(addReport(fakeReport));
        expect(store.getState().reports.reports).toEqual([fakeReport]);
    });
    it("should handle fetchReports", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: [fakeReport] });
        await store.dispatch(fetchReports({ lat: 0, lng: 0, radius: 10 }));
        expect(store.getState().reports.reports).toEqual([fakeReport]);
    });
    it("should handle error on addReport", async () => {
        const mockConsoleError = jest.fn();
        console.error = mockConsoleError;
        jest.spyOn(axios, "post").mockRejectedValue({
            response: { data: { title: ["error"] } },
        });
        await store.dispatch(addReport(fakeReport));
        expect(mockConsoleError).toBeCalled();
    });
});
