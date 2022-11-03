import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import React from "react";
import PostModal from "./PostModal";
import userEvent from "@testing-library/user-event";

describe("<PostModal />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should handle not open", async () => {
        axios.post = jest.fn().mockResolvedValue({});
        const callbackMock = jest.fn();
        render(
            <PostModal
                openPost={false}
                setOpenPost={jest.fn()}
                postModalCallback={callbackMock}
                type={"Post"}
                replyTo={0}
            />
        );
    });
    it("should handle not submit form if empty", async () => {
        axios.post = jest.fn().mockResolvedValue({});
        const callbackMock = jest.fn();
        render(
            <PostModal
                openPost={true}
                setOpenPost={jest.fn()}
                postModalCallback={callbackMock}
                type={"Post"}
                replyTo={0}
            />
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
        render(
            <PostModal
                openPost={true}
                setOpenPost={jest.fn()}
                postModalCallback={callbackMock}
                type={"Post"}
                replyTo={0}
            />
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
            <PostModal
                openPost={true}
                setOpenPost={jest.fn()}
                postModalCallback={callbackMock}
                type={"Reply"}
                replyTo={1}
            />
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
            <PostModal
                openPost={true}
                setOpenPost={jest.fn()}
                postModalCallback={jest.fn()}
                type={"Post"}
                replyTo={0}
            />
        );
        const closeButton = screen.getByTestId("closeButton");
        fireEvent.click(closeButton);
    });
    it("should change textfield properly", async () => {
        render(
            <PostModal
                openPost={true}
                setOpenPost={jest.fn()}
                postModalCallback={jest.fn()}
                type={"Post"}
                replyTo={0}
            />
        );
        const textField = screen.getByTestId("textField");
        fireEvent.change(textField, { target: { value: "TEXT" } });
        await waitFor(() => screen.findByText("TEXT"));
    });
});
