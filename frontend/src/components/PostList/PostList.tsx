import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostType } from "../../containers/AreaFeed/AreaFeed";
import Post from "../Post/Post";
import PostModal from "../PostModal/PostModal";

function PostList({
    type,
    postListCallback,
    replyTo,
    allPosts,
}: {
    type: string;
    postListCallback: () => void;
    replyTo: number;
    allPosts: PostType[];
}) {
    const navigate = useNavigate();
    const [openPost, setOpenPost] = useState<boolean>(false);

    // get user from backend with user_id
    const users: { user_name: string; id: number }[] = [
        { user_name: "WeatherFairy", id: 1 },
        { user_name: "Toothfairy", id: 2 },
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
                                    users.find((user) => user.id === post.user)!
                                        .user_name
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
