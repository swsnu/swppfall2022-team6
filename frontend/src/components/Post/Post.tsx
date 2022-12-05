import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../store/slices/user";
import { fetchChainedPost, PostType, selectPost } from "../../store/slices/post";
import { AppDispatch } from "../../store";

import "./Post.scss";
export interface postProps {
    id: number;
    user_name: string;
    content: string;
    badge_id: number;
    image: string; // image url, "" if none
    location: string;
    created_at: string; // date & time string
    reply_to_author: string | null; // id of the chained post
    clickPost?: React.MouseEventHandler<HTMLDivElement>;
    toggleChain?: () => void; // toggle chain open/close
    isReplyList: number; // 0 when not, from replyTo in postlist
}
// get location from user lang, long

function Post(post: postProps) {
    const postState = useSelector(selectPost);
    const userState = useSelector(selectUser);

    // set chain toggle status
    const [isChainOpen, setChainOpen] = useState<boolean>(false);
    // get replied post
    const [chainedPosts, setChainedPosts] = useState<PostType[]>([]);

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (isChainOpen) {
            dispatch(fetchChainedPost(post.id))
                .then(unwrapResult)
                .then((result) => {
                    setChainedPosts(result);
                });
        }
    }, [isChainOpen]);
    // TODO: get image from backend
    // const mapbadges = (author_name: string) => {
    //     if (author_name == "kmy") {
    //         return "/badge2.svg";
    //     } else if (author_name == "msy") {
    //         return "/badge3.svg";
    //     } else if (author_name == "lys") {
    //         return "/badge4.svg";
    //     } else if (author_name == "ice") {
    //         return "/badge5.svg";
    //     } else {
    //         return "/badge1.svg";
    //     }
    // };
    const clickPostHandler = (post: PostType) => {
        navigate("/areafeed/" + post.id);
    };
    const clickToggleChain = () => {
        setChainOpen(!isChainOpen);
    };
    const renderChainedPosts = (): JSX.Element[] => {
        const chain = chainedPosts.map((post: PostType) => {
            return (
                <Post
                    key={post.id}
                    id={post.id}
                    user_name={post.user_name}
                    badge_id={post.badge_id}
                    content={post.content}
                    location={"Location"} //should come from map API
                    created_at={post.created_at}
                    reply_to_author={post.reply_to_author}
                    image={post.image ? post.image : ""}
                    clickPost={() => clickPostHandler(post)}
                    isReplyList={1}
                />
            );
        });
        return chain;
    };
    return (
        <div id="post-and-chain-container" className="d-flex flex-column ">
            <div
                id="post-container"
                className="p-1 mt-2 ms-2"
                onClick={post.clickPost}
            >
                <div
                    id="main-post-div"
                    className="d-flex justify-content-start"
                >
                    <div id="user-main-badge">
                        <img
                            className="badge-image"
                            src={userState.userBadges.find((badge) => badge.id === post.badge_id)?.image}
                            alt="sample"
                            style={{ height: "5vh", width: "auto" }}
                        />
                    </div>
                    <div
                        id="post-right-container"
                        className="d-flex flex-column ms-1 align-items-start"
                    >
                        <div
                            id="user-name"
                            className="d-flex justify-content-start gap-1 fw-bold fs-5-5"
                        >
                            {post.user_name}
                        </div>
                        <div
                            id="time-and-location"
                            className="d-flex justify-content-start gap-1 fw-light fs-7 mt-1"
                        >
                            <div id="location" className="tldiv">
                                {post.location}
                            </div>
                            <div> . </div>
                            <div
                                id="timestamp"
                                className="tldiv"
                                style={{ fontSize: "3px" }}
                            >
                                {new Date(post.created_at).toLocaleDateString(
                                    "ko-KR",
                                    {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </div>
                        </div>
                        <div
                            id="post-content-container"
                            className="d-flex justify-content-start gap-1 mt-2"
                        >
                            {post.content === "" ? null : (
                                <div
                                    id="post-content"
                                    className="text-start fw-normal ms-2"
                                >
                                    {post.reply_to_author === null ? null : (
                                        <span
                                            id="post-reply-to"
                                            className="text-primary"
                                        >
                                            @{post.reply_to_author}{" "}
                                        </span>
                                    )}
                                    <span id="post-text">{post.content}</span>
                                </div>
                            )}
                        </div>
                        {post.image === "" ? null : (
                            <div id="post-photo" className="ms-3">
                                <img src={post.image} className="post-image" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Show chain when it is a reply */}
            {post.isReplyList !== 0 ||
            post.reply_to_author === null ? null : isChainOpen === false ? (
                <div
                    id="chain-container"
                    className="p-1 d-flex justify-content-start"
                >
                    <button
                        id="chain-toggle-button"
                        type="button"
                        className="btn btn-link text-decoration-none"
                        onClick={clickToggleChain}
                    >
                        Show All
                    </button>
                </div>
            ) : (
                <div id="chain-container" className="p-1">
                    <div
                        id="chained-posts"
                        className="d-flex flex-column gap-2"
                    >
                        {renderChainedPosts()}
                    </div>
                    <div
                        id="chain-toggle"
                        className="p-2 d-flex justify-content-start"
                    >
                        <button
                            id="chain-toggle-button"
                            type="button"
                            className="btn btn-link text-decoration-none"
                            onClick={clickToggleChain}
                        >
                            Close All
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Post;
