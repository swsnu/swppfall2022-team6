import axios from "axios";
import React, { useEffect, useState } from "react";
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
    const [mainPost, setMainPost] = useState<PostType>({
            id: 1,
            user: 1,
            content: "Default Original Post...",
            latitude: 37.44877599087201,
            longitude: 126.95264777802309,
            created_at: new Date().toLocaleDateString(),
            image: "/img2.png",
            reply_to: null,
            hashtags: [],
        });
    const [replyPosts, setReplyPosts] = useState<PostType[]>([]);
    const users: { user_name: string; user_id: number }[] = [
        { user_name: "WeatherFairy", user_id: 1 },
        { user_name: "Toothfairy", user_id: 2 },
    ];

    useEffect(() => {
        // update mainPost, replyPosts
        axios
            .get(`/post/${id}/`)
            .then((response) => {
                setMainPost(response.data["post"]);
                setReplyPosts(response.data["replies"]);
            });
    }, []);

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
                        <img src={'/logo192.png'} alt="sample"/>
                    </div>
                    <div id="author-container">
                        <div id="author-info">
                            <div id="author-name">
                                {users.find((user) => user.user_id === mainPost.user)!
                            .user_name}
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
                    {mainPost.content}
                </div>
                <div id="main-post-image">
                    {mainPost.image === null
                    ? null
                    : <img src={mainPost.image} alt="sample"/>
                    }
                </div>
                <div id="lower-post-container">
                    <div id="hashtag-container">
                        {mainPost.hashtags.map((hashtag,i) =>
                        <div key={`hashtag${i}`} className="hashtag">{hashtag.content}</div>)}
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