import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import PostList from "../../components/PostList/PostList";
import { PostType } from "../AreaFeed/AreaFeed";
import "./PostDetail.scss";


function PostDetail() {
    const postListCallback = () => {}; // axios.get again
    const { id } = useParams();
    const navigate = useNavigate();
    const onClickBackButton = () => {
        navigate("/areafeed/");
    };
    const [replyPosts, setReplyPosts] = useState<PostType[]>([
        {
            id: 2,
            user: 2,
            content: "reply1",
            latitude: 37.44877599087201,
            longitude: 126.95264777802309,
            created_at: new Date().toLocaleDateString(),
            reply_to: 1,
            image: "",
            hashtags: [],
        },
        {
            id: 1,
            user: 1,
            content:
                "reply2",
            latitude: 37.44877599087201,
            longitude: 126.95264777802309,
            created_at: new Date().toLocaleDateString(),
            image: "",
            reply_to: 0,
            hashtags: [],
        },
    ]);
    //get id from backend
    const post = {
        id: 2,
        user_id: 2,
        content: "지금 설입은 비 오는 중!",
        latitude: 37.44877599087201,
        longitude: 126.95264777802309,
        time: new Date().toLocaleDateString(),
        image: "img1.png",
    }
    return (
        <div className="PostDetail">
            <div id="upper-container">
                <div id="page-header">
                    <button id="back-button" onClick={onClickBackButton}>
                        ←
                    </button>
                </div>
            </div>
            <div id="main-post-container">
                <div id="upper-post-container">
                    <div id="author-main-badge">
                        <img src={'/logo192.png'} alt="sample" className="badge"/>
                    </div>
                    <div id="author-container">
                        <div id="author-info">
                            <div id="author-name">
                                WeatherFairy
                                {/* Get user name from back */}
                            </div>
                            <div id="author-location">
                            Bongcheon-dong, Gwankak-gu
                            {/* Get address */}
                        </div>
                        </div>
                    </div>
                </div>
                <div id="main-post-content">
                    {post.content}
                </div>
                <div id="main-post-image">
                    {post.image === null
                    ? null
                    : <img src={'/img2.png'} alt="sample" className="postimage"/>
                    }
                </div>
                <div id="lower-post-container">
                    <div id="hashtag-container">
                        <div id="hashtag1" className="hashtag">#hashtag1</div>
                        <div id="hashtag2" className="hashtag">#hashtag2</div>
                        <div id="hashtag3" className="hashtag">#hashtag3</div>
                        {/* hashtags */}
                    </div>
                </div>
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