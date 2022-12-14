import React, { useEffect, useState } from "react";
import "./PostModal.scss";
import { TextField } from "@mui/material";
import { addPost } from "../../store/slices/post";
import {
    selectUser,
    Achievement,
    updateUserAchievements,
} from "../../store/slices/user";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { useParams } from "react-router";
import { selectPosition } from "../../store/slices/position";
import { ApiErrorCode, selectApiError, setDefaultApiError } from "../../store/slices/apierror";


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
    const positionState = useSelector(selectPosition);
    const errorState = useSelector(selectApiError);

    const [content, setContent] = useState<string>("");
    const [image, setImage] = useState<File>();
    const [hashtags, setHashtags] = useState<string>("");
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams();
    const userState = useSelector(selectUser);
    const geocoder = new kakao.maps.services.Geocoder();
    const [address, setAddress] = useState<string>("");


    useEffect(()=>{
        dispatch(setDefaultApiError())
      }, []);

    useEffect(() => {
        if (positionState.currPosition) {
            geocoder.coord2RegionCode(
                positionState.currPosition.lng,
                positionState.currPosition.lat,
                (result, status) => {
                    if (
                        status === kakao.maps.services.Status.OK &&
                        !!result[0].address_name
                    ) {
                        setAddress(result[0].address_name);
                    }
                }
            );
        }
    }, []);

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
            if (positionState.findPosition){
                formData.append("latitude", positionState.findPosition.lat.toString());
                formData.append("longitude", positionState.findPosition.lng.toString());
                formData.append("location", address);
            }
            //@ts-ignore
            const response = await dispatch(addPost(formData));
            if (errorState.apiError.code === ApiErrorCode.NONE){
                // update Post-related Achievement(Reply)
                if (type === "Reply") {
                    const achievement_type: Achievement = Achievement.REPLY;
                    if (
                        !userState.userBadges[achievement_type - 1].is_fulfilled
                    ) {
                        dispatch(
                            updateUserAchievements({
                                id: Number(userState.currUser?.id),
                                type: achievement_type,
                            })
                        );
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
        if (e.target.files) {
            if (e.target.files[0].size > 1048576) {
                alert("File size is too big! Max size is 1MB");
                e.target.value = "";
            } else setImage(e.target.files[0]);
        }
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
                                    inputProps={{
                                        "data-testid": "textField",
                                        maxLength: 290,
                                    }}
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
                                        maxLength: 20,
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
