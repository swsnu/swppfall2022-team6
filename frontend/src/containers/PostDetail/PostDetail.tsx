import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import NavigationBar from "../../components/NavigationBar/NavigationBar";
import PostList from "../../components/PostList/PostList";
import { PostType } from "../AreaFeed/AreaFeed";

import "./PostDetail.scss";

function PostDetail() {
    const postListCallback = () => {
        setRefresh(true);
    }; // axios.get again
    const { id } = useParams();
    const navigate = useNavigate();
    const onClickBackButton = () => {
        navigate("/areafeed/");
    };
    // TODO: get badge image from backend

    const [mainPost, setMainPost] = useState<PostType>({
        id: 1,
        user_name: "swpp",
        content: "Default Original Post...",
        latitude: 37.44877599087201,
        longitude: 126.95264777802309,
        created_at: new Date().toLocaleDateString(),
        image: "/media/2022/11/07/screenshot.png",
        reply_to_author: null,
        hashtags: [],
    });
    const [replyPosts, setReplyPosts] = useState<PostType[]>([]);
    // const users: { user_name: string; user_id: number }[] = [
    //     { user_name: "WeatherFairy", user_id: 1 },
    //     { user_name: "Toothfairy", user_id: 2 },
    // ];
    const [refresh, setRefresh] = useState<Boolean>(true);

    useEffect(() => {
        // update mainPost, replyPosts
        axios.get(`/post/${id}/`).then((response) => {
            setMainPost(response.data["post"]);
            setReplyPosts(response.data["replies"]);
        });
        setRefresh(false);
    }, [refresh]);

    return (
        <div className="PostDetail">
            <div id="upper-container">
                <div id="page-header">
                    <button id="back-button" 
                    aria-label='back'
                    onClick={onClickBackButton}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                </div>
            </div>
            <div id="main-post-container">
                <div id="upper-post-container">
                    <div id="author-main-badge">
                        <img src={"sample"} style={{ height: "5vh", width: "auto" }}/>
                    </div>
                    <div id="author-container">
                        <div id="author-info">
                            <div id="author-name" className="fw-bolder fs-5 mb-1">
                                {mainPost.user_name}
                                {/* Get user name from back */}
                            </div>
                            <div
                                id="time-and-location"
                                className="d-flex justify-content-start fw-light gap-1 fs-7 mt-1"
                            >
                                <div id="author-location"
                                style={{ fontSize: "11px"}}>
                                    관악구 봉천동
                                    {/* Get address */}
                                </div>
                                <div>.</div>
                                <div
                                    id="timestamp"
                                    className="tldiv"
                                    style={{ fontSize: "11px"}}>
                                    {new Date(mainPost.created_at).toLocaleDateString(
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
                        </div>
                    </div>
                </div>
                <div id="main-post-content"
                className="text-start">{mainPost.content}</div>
                {mainPost.image === null ? null : (
                    <div id="main-post-image-div">
                        <img
                            id="main-post-image"
                            src={mainPost.image}
                            alt="sample"
                            style={{ height: "30vh", width: "auto" }}
                        />
                    </div>
                )}
                <div id="lower-post-container">
                    <div id="hashtag-container">
                        {mainPost.hashtags.map((hashtag, i) => (
                            <div key={`hashtag${i}`} className="hashtag">
                                {"#" + hashtag.content}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div id="reply-posts-container"
            className="">
                <div id=""
                    style={{
                        width: "100%",
                        textAlign: "start",
                        padding: "0 20px",
                    }}>
                    Replies
                </div>
                <PostList
                    type={"Reply"}
                    postListCallback={postListCallback}
                    replyTo={Number(id)}
                    allPosts={replyPosts}
                />
            </div>
            <NavigationBar />
        </div>
    );
}

export default PostDetail;