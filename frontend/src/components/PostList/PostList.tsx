import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Post, { PostType } from "../Post/Post";

function PostList() {
    const onClickAddPostButton = () => {};
    const navigate = useNavigate();

    const [allPosts, setAllPosts] = useState<PostType[]>([
        {
            id: 2,
            user_id: 2,
            content: "�б��� ���� ��׿�Ф�\n�ѿ� ì��ô°� ���� �� ���ƿ�!",
            latitude: 37.44877599087201,
            longitude: 126.95264777802309,
            time: new Date().toLocaleDateString(),
            reply_to: 1,
            chain_open: false,
        },
        {
            id: 1,
            user_id: 1,
            content:
                "���� ������ ���� �ѵ� �ٶ��� ���� �Ҿ��\n�ѿ��� �� ì�� ���Դµ� �б��� �䳪��? �ڿ��� �ʿ�...",
            latitude: 37.44877599087201,
            longitude: 126.95264777802309,
            time: new Date().toLocaleDateString(),
            reply_to: 0,
        },
    ]);

    // map ���ؼ� lat, long ó�� + chain_open, username �߰��� postProps

    const clickPostHandler = (post: PostType) => {
        navigate("/areafeed/" + post.id);
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
