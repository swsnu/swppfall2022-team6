import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Post from "../Post/Post";
import PostModal from "../PostModal/PostModal";

export type HashtagType = {
    id: number;
    content: string;
}

export type PostType = {
    id: number;
    user: number;
    content: string;
    image: string; // image url
    latitude: number;
    longitude: number;
    created_at: string;
    reply_to: number | null; // id of the chained post
    hashtag: Array<HashtagType>
};

function PostList({
    type,
    postListCallback,
    replyTo,
}: {
    type: string;
    postListCallback: () => void;
    replyTo: number;
}) {
    const navigate = useNavigate();
    const [openPost, setOpenPost] = useState<boolean>(false);

    const [allPosts, setAllPosts] = useState<PostType[]>([
        {
            id: 2,
            user: 2,
            content: "학교는 많이 춥네요ㅠㅠ\n겉옷 챙기시는게 좋을 것 같아요!",
            latitude: 37.44877599087201,
            longitude: 126.95264777802309,
            created_at: new Date().toLocaleDateString(),
            reply_to: 1,
            image: "",
            hashtag: [{id: 1, content: "Sunny"}]
        },
        {
            id: 1,
            user: 1,
            content:
                "지금 설입은 맑긴 한데 바람이 많이 불어요\n겉옷을 안 챙겨 나왔는데 학교도 춥나요? 자연대 쪽에...",
            latitude: 37.44877599087201,
            longitude: 126.95264777802309,
            created_at: new Date().toLocaleDateString(),
            image: "",
            reply_to: null,
            hashtag: [{id: 1, content: "Sunny"}]
        },
    ]);

    // get user from backend with user_id
    const users: { user_name: string; user_id: number }[] = [
        { user_name: "WeatherFairy", user_id: 1 },
        { user_name: "Toothfairy", user_id: 2 },
    ];

    const post_location = "Bongcheon-dong, Gwanak-gu"; //should be implemented with Map API,

    const clickPostHandler = (post: PostType) => {
        navigate("/areafeed/" + post.id);
    };
    const onClickAddPostButton = () => {
        setOpenPost(true);
    };
    const postModalCallback = () => {
        setOpenPost(false);
        postListCallback();
    };

    return (
        <div id="PostList">
            <div id="PostsContainer">
                <div id="posts">
                    {allPosts.map((post) => {
                        return (
                            <Post
                                key={post.id}
                                id={post.id}
                                user_name={
                                    users.find(
                                        (user) => user.user_id === post.user
                                    )!.user_name
                                }
                                content={post.content}
                                location={post_location} //should come from map API
                                created_at={post.created_at}
                                reply_to={post.reply_to}
                                image={""}
                                clickPost={() => clickPostHandler(post)}
                                // toggleChain={} for chain open/close w useState
                            />
                        );
                    })}
                </div>
            </div>
            {type === "Mypage" ? null : (
                <div>
                    <button id="add-post-button" onClick={onClickAddPostButton}>
                        Add {type}
                    </button>
                    <PostModal
                        openPost={openPost}
                        setOpenPost={setOpenPost}
                        postModalCallback={postModalCallback}
                        type={type}
                        replyTo={replyTo}
                    />
                </div>
            )}
        </div>
    );
}

export default PostList;
