import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import React from "react";
import PostModal from "./PostModal";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { mockStore, mockStoreHashFeed1, mockStorePostModal1 } from "../../test-utils/mock";
import { MemoryRouter, Route, Routes } from "react-router";

const mockResultData = [
    {
        address_name: "서울특별시 관악구 신림동",
    },
];
const kakao = {
    maps: {
        services: {
            Geocoder: jest.fn(),
            Status: {
                OK: "OK",
                ZERO_RESULT: "ZERO_RESULT",
                ERROR: "ERROR",
            },
        },
    },
};

describe("<PostModal />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.kakao = kakao as any;
        const mockCoord2RegionCode = jest.fn((lng, lat, callback) =>
            callback(mockResultData, "OK")
        );
        (kakao.maps.services.Geocoder as jest.Mock).mockReturnValue({
            coord2RegionCode: mockCoord2RegionCode,
        });
    });
    it("should handle not open", async () => {
        axios.post = jest.fn().mockResolvedValue({});
        const callbackMock = jest.fn();
        render(
            <Provider store={mockStore}>
                <PostModal
                    openPost={false}
                    setOpenPost={jest.fn()}
                    postModalCallback={callbackMock}
                    type={"Post"}
                    replyTo={0}
                />
            </Provider>
        );
        expect(() => screen.getByText("📷 Add Photo")).toThrow();
    });
    it("should handle not submit form if empty", async () => {
        axios.post = jest.fn().mockResolvedValue({});
        const callbackMock = jest.fn();
        render(
            <Provider store={mockStore}>
                <PostModal
                    openPost={true}
                    setOpenPost={jest.fn()}
                    postModalCallback={callbackMock}
                    type={"Post"}
                    replyTo={0}
                />
            </Provider>
        );
        const submitButton = screen.getByText("Submit!");
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(callbackMock).not.toHaveBeenCalled();
        });
    });
    it("should change photo properly", async () => {
        axios.post = jest.fn().mockResolvedValue({});
        const callbackMock = jest.fn();
        const file = new File(["TEST"], "test.png", { type: "image/png" });
        Object.defineProperty(file, "size", { value: 1048570 });
        render(
            <Provider store={mockStore}>
                <PostModal
                    openPost={true}
                    setOpenPost={jest.fn()}
                    postModalCallback={callbackMock}
                    type={"Post"}
                    replyTo={0}
                />
            </Provider>
        );
        const fileUploader = screen.getByTestId("fileUploader");
        fireEvent.change(fileUploader, { target: { files: null } });
        userEvent.upload(fileUploader, file);
        const submitButton = screen.getByText("Submit!");
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(callbackMock).toHaveBeenCalled();
        });
    });
    it("should submit content if only exists", async () => {
        axios.post = jest.fn().mockResolvedValue({});
        const callbackMock = jest.fn();
        render(
            <Provider store={mockStore}>
                <PostModal
                    openPost={true}
                    setOpenPost={jest.fn()}
                    postModalCallback={callbackMock}
                    type={"Reply"}
                    replyTo={1}
                />
            </Provider>
        );
        const textField = screen.getByTestId("textField");
        fireEvent.change(textField, { target: { value: "TEXT" } });
        const submitButton = screen.getByText("Submit!");
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(callbackMock).toHaveBeenCalled();
        });
    });
    it("should close modal properly", async () => {
        axios.post = jest.fn().mockResolvedValue({});
        render(
            <Provider store={mockStore}>
                <PostModal
                    openPost={true}
                    setOpenPost={jest.fn()}
                    postModalCallback={jest.fn()}
                    type={"Post"}
                    replyTo={0}
                />
            </Provider>
        );
        const closeButton = screen.getByTestId("closeButton");
        fireEvent.click(closeButton);
    });
    it("should change textfield properly", async () => {
        render(
            <Provider store={mockStore}>
                <PostModal
                    openPost={true}
                    setOpenPost={jest.fn()}
                    postModalCallback={jest.fn()}
                    type={"Post"}
                    replyTo={0}
                />
            </Provider>
        );
        const textField = screen.getByTestId("textField");
        fireEvent.change(textField, { target: { value: "TEXT" } });
        await waitFor(() => screen.findByText("TEXT"));
    });
    it("should change hashtag properly", async () => {
        render(
            <Provider store={mockStore}>
                <PostModal
                    openPost={true}
                    setOpenPost={jest.fn()}
                    postModalCallback={jest.fn()}
                    type={"Post"}
                    replyTo={0}
                />
            </Provider>
        );
        const textField = screen.getByTestId("hashtagField");
        fireEvent.change(textField, { target: { value: "TEXT" } });
    });
    it("should handle achievements", async () => {
        axios.post = jest
            .fn()
            .mockResolvedValue({ data: { payload: "payload" } });
        axios.put = jest.fn().mockResolvedValue({});
        const mockCb = jest.fn();
        render(
            <Provider store={mockStoreHashFeed1}>
                <MemoryRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <PostModal
                                    openPost={true}
                                    setOpenPost={jest.fn()}
                                    postModalCallback={mockCb}
                                    type={"Reply"}
                                    replyTo={0}
                                />
                            }
                        />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const textField = screen.getByTestId("textField");
        fireEvent.change(textField, { target: { value: "TEXT" } });
        const submitButton = screen.getByText("Submit!");
        fireEvent.click(submitButton);
        await waitFor(() => expect(mockCb).toHaveBeenCalled());
    });
    it("should not handle achievements if true", async () => {
        axios.post = jest
            .fn()
            .mockResolvedValue({ data: { payload: "payload" } });
        axios.put = jest.fn().mockResolvedValue({});
        const mockCb = jest.fn();
        render(
            <Provider store={mockStorePostModal1}>
                <MemoryRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <PostModal
                                    openPost={true}
                                    setOpenPost={jest.fn()}
                                    postModalCallback={mockCb}
                                    type={"Reply"}
                                    replyTo={0}
                                />
                            }
                        />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const textField = screen.getByTestId("textField");
        fireEvent.change(textField, { target: { value: "TEXT" } });
        const submitButton = screen.getByText("Submit!");
        fireEvent.click(submitButton);
        await waitFor(() => expect(mockCb).toHaveBeenCalled());
    });
    it("should not handle achievements if not reply", async () => {
        axios.post = jest
            .fn()
            .mockResolvedValue({ data: { payload: "payload" } });
        axios.put = jest.fn().mockResolvedValue({});
        const mockCb = jest.fn();
        render(
            <Provider store={mockStoreHashFeed1}>
                <MemoryRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <PostModal
                                    openPost={true}
                                    setOpenPost={jest.fn()}
                                    postModalCallback={mockCb}
                                    type={"Post"}
                                    replyTo={0}
                                />
                            }
                        />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const textField = screen.getByTestId("textField");
        fireEvent.change(textField, { target: { value: "TEXT" } });
        const submitButton = screen.getByText("Submit!");
        fireEvent.click(submitButton);
        await waitFor(() => expect(mockCb).toHaveBeenCalled());
    });
    it("should not change big photo", async () => {
        axios.post = jest.fn().mockResolvedValue({});
        jest.spyOn(window, "alert").mockImplementation(() => {});
        const callbackMock = jest.fn();
        const file = new File(["TEST"], "test.png", { type: "image/png" });
        Object.defineProperty(file, "size", { value: 1048580 });
        render(
            <Provider store={mockStore}>
                <PostModal
                    openPost={true}
                    setOpenPost={jest.fn()}
                    postModalCallback={callbackMock}
                    type={"Post"}
                    replyTo={0}
                />
            </Provider>
        );
        const fileUploader = screen.getByTestId("fileUploader");
        fireEvent.change(fileUploader, { target: { files: null } });
        userEvent.upload(fileUploader, file);
        expect(window.alert).toHaveBeenCalled();
    });
    it("should handle no location", async () => {
        axios.post = jest.fn().mockResolvedValue({});
        const callbackMock = jest.fn();
        render(
            <Provider store={mockStore}>
                <PostModal
                    openPost={true}
                    setOpenPost={jest.fn()}
                    postModalCallback={callbackMock}
                    type={"Post"}
                    replyTo={0}
                />
            </Provider>
        );
        const textField = screen.getByTestId("textField");
        fireEvent.change(textField, { target: { value: "TEXT" } });
        const submitButton = screen.getByText("Submit!");
        fireEvent.click(submitButton);
        await waitFor(() => expect(callbackMock).toHaveBeenCalled());
    });
});
