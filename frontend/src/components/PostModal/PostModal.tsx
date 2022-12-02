import axios from "axios";
import React, { useEffect, useState } from "react";
import "./PostModal.scss";
import { TextField } from "@mui/material";
import { addPost } from "../../store/slices/post";
import { selectUser, Achievement, updateUserAchievements } from "../../store/slices/user";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { useParams } from "react-router";

export interface IProps {
    openPost: boolean;
    setOpenPost: React.Dispatch<React.SetStateAction<boolean>>;
    postModalCallback: () => void;
    type: string;
    replyTo: number;
}

function PostModal({
    openPost,
    setOpenPost,
    postModalCallback,
    type,
    replyTo,
}: IProps) {
    const [content, setContent] = useState<string>("");
    const [image, setImage] = useState<File>();
    const [hashtags, setHashtags] = useState<string>("");
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams();
    const userState = useSelector(selectUser);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (image || content) {
            const formData = new FormData();
            if (image) formData.append("image", image);
            formData.append("content", content);
            if (type === "Post" && id !== undefined) formData.append("hid", id);
            formData.append("hashtags", hashtags);
            if (type === "Reply")
                formData.append("replyTo", replyTo.toString());
            //@ts-ignore
            const response = await dispatch(addPost(formData));
            if (response.payload){
                // update Post-related Achievement(Reply)
                if (type === "Reply"){
                    const achievement_type: Achievement = Achievement.REPLY;
                    if (!userState.userBadges[achievement_type-1].is_fulfilled){
                        dispatch(updateUserAchievements({id: Number(userState.currUser?.id), type: achievement_type}));
                    }
                }
            }
            setContent("");
            setHashtags("");
            postModalCallback();
        }
    };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files) setImage(e.target.files[0]);
    };

    return (
        <div className={openPost ? "postModal modal" : "modal"}>
            {openPost ? (
                <section>
                    <header style={{ display: "flex" }}>
                        {type}
                        <button
                            data-testid="closeButton"
                            className="close-button"
                            onClick={() => setOpenPost(false)}
                        >
                            X
                        </button>
                    </header>
                    <main>
                        <form onSubmit={handleSubmit}>
                            <p id="photo-container">
                                <span id="photo-label">📷 Add Photo</span>
                                <input
                                    id="photo-input image"
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={handleImageChange}
                                    style={{
                                        paddingLeft: "75px",
                                        fontSize: "9px",
                                    }}
                                    data-testid="fileUploader"
                                />
                            </p>
                            <div style={{ margin: "0px 50px" }}>
                                <TextField
                                    inputProps={{ "data-testid": "textField" }}
                                    id="standard-basic"
                                    variant="standard"
                                    placeholder="Add Text"
                                    size="small"
                                    multiline
                                    fullWidth
                                    margin="normal"
                                    value={content}
                                    rows={5}
                                    spellCheck={false}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>
                            <div style={{ margin: "0px 50px" }}>
                                <TextField
                                    inputProps={{
                                        "data-testid": "hashtagField",
                                    }}
                                    id="standard-basic"
                                    variant="standard"
                                    placeholder="#Hash #tags"
                                    size="small"
                                    fullWidth
                                    margin="normal"
                                    value={hashtags}
                                    spellCheck={false}
                                    rows={1}
                                    onChange={(e) =>
                                        setHashtags(e.target.value)
                                    }
                                />
                            </div>
                            <p>
                                <input
                                    type="submit"
                                    id="submit-button"
                                    value="Submit!"
                                />
                            </p>
                        </form>
                    </main>
                </section>
            ) : null}
        </div>
    );
}

export default PostModal;
