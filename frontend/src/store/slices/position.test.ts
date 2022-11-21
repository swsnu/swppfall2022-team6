import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { ThunkMiddleware } from "redux-thunk";
import axios from "axios";
import reducer, { PositionState, setPosition } from "./position";

describe("report reducer", () => {
    type NewType = EnhancedStore<
        {
            positions: PositionState;
        },
        AnyAction,
        [
            ThunkMiddleware<
                {
                    positions: PositionState;
                },
                AnyAction,
                undefined
            >
        ]
    >;

    let store: NewType;
    const fakePosition = {
        lat: 37.44877599087201,
        lng: 126.95264777802309,
    };
    beforeAll(() => {
        store = configureStore({ reducer: { positions: reducer } });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should handle initial state", () => {
        expect(reducer(undefined, { type: "unknown" })).toEqual({
            position: fakePosition,
        });
    });
    it("should handle setPosition", async () => {
        await store.dispatch(setPosition(fakePosition));
        expect(store.getState().positions.position).toEqual(fakePosition);
    });
});
