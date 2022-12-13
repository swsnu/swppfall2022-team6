import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../store/slices/user";
import { fetchChainedPost, PostType } from "../../store/slices/post";
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

function Post(post: postProps) {
    const userState = useSelector(selectUser);

    const [isChainOpen, setChainOpen] = useState<boolean>(false);
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
                    location={post.location}
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
        <div id="post-and-chain-container" 
        // className="d-flex flex-column "
        >
            <div
                id="post-container"
                // className="p-1 mt-2 ms-2"
                onClick={post.clickPost}
            >
                <div id="main-post-div">
                    <div id="user-info">
                        <div id="user-main-badge">
                            <img
                                className="badge-image"
                                src={userState.userBadges.find((badge) => badge.id === post.badge_id)?.image}
                                alt="sample"
                            />
                        </div>
                        <div id="post-right-container">
                            <div id="user-name">
                                {post.user_name}
                            </div>
                            <div id="time-and-location">
                                <span id="location" > {post.location? post.location: "No location"} </span>
                                <span style={{fontWeight: 900}}> · </span>
                                <span id="timestamp">
                                    {new Date(post.created_at).toLocaleTimeString(
                                        "ko-KR",
                                        {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div id="post-content-container">
                        {post.content === "" ? null : (
                            <div id="post-content">
                                {post.reply_to_author === null ? null : (
                                    <span id="post-reply-to">
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
            {post.isReplyList !== 0 ||
            post.reply_to_author === null ? null : isChainOpen === false ? (
                <div id="chain-container">
                    <button
                        className="chain-toggle-button"
                        type="button"
                        onClick={clickToggleChain}
                    >
                        Show All
                    </button>
                </div>
            ) : (
                <div id="chain-container">
                    <div id="chained-posts">
                        {renderChainedPosts()}
                    </div>
                    <div id="chain-toggle">
                        <button
                            className="chain-toggle-button"
                            type="button"
                            onClick={clickToggleChain}
                            style={{marginTop: "5px"}}
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
