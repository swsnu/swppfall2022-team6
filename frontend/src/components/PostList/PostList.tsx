import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Post, { PostType } from "../Post/Post";
import { AppDispatch } from "../../store";

function PostList() {
    const onClickAddPostButton = () => {};
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [allPosts, setAllPosts] = useState<PostType[]>([
        {
            id: 2,
            user_id: 2,
            content: "학교는 많이 춥네요ㅠㅠ\n겉옷 챙기시는게 좋을 것 같아요!",
            latitude: 37.44877599087201,
            longitude: 126.95264777802309,
            time: new Date().toLocaleDateString(),
            reply_to: 1,
            chain_open: false
        },
        {
            id: 1,
            user_id: 1,
            content: "지금 설입은 맑긴 한데 바람이 많이 불어요\n겉옷을 안 챙겨 나왔는데 학교도 춥나요? 자연대 쪽에...",
            latitude: 37.44877599087201,
            longitude: 126.95264777802309,
            time: new Date().toLocaleDateString(),
            reply_to: 0
        }
    ])

    // map 통해서 lat, long 처리 + chain_open, username 추가한 postProps

    const clickPostHandler = (post: PostType) => {
        navigate("/detail/" + post.id);
    };
    
    return (
        <div id="PostList">
            <div id="PostsContainer">
                <div id="posts">
                    {allPosts.map((post) => {
                        return (
                            <Post
                                id={post.id}
                                user_id={post.user_id}
                                content={post.content}
                                latitude={post.latitude}
                                longitude={post.longitude}
                                time={post.time}
                                reply_to={post.reply_to}
                                chain_open={post.chain_open}
                                clickPost={() => clickPostHandler(post)}
                            />
                        );
                    })}
                </div>
            </div>
            <button id="add-post-button" onClick={onClickAddPostButton}>
                Add Post
            </button>
        </div>
    );
}

export default PostList;
