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
                    <button id="back-button" onClick={onClickBackButton}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                </div>
            </div>
            <div id="main-post-container">
                <div id="upper-post-container">
                    <div id="author-main-badge">
                        <img src={"/logo192.png"} alt="sample" />
                    </div>
                    <div id="author-container">
                        <div id="author-info">
                            <div id="author-name">
                                {mainPost.user_name}
                                {/* Get user name from back */}
                            </div>
                            <div id="author-location">
                                Bongcheon-dong, Gwankak-gu
                                {/* Get address */}
                            </div>
                        </div>
                    </div>
                </div>
                <div id="main-post-content">{mainPost.content}</div>
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
            <div
                style={{
                    width: "100%",
                    textAlign: "start",
                    padding: "0 20px",
                }}
            >
                Replies
            </div>
            <PostList
                type={"Reply"}
                postListCallback={postListCallback}
                replyTo={Number(id)}
                allPosts={replyPosts}
            />
            <NavigationBar />
        </div>
    );
}

export default PostDetail;
