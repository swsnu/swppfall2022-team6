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
    allPosts:PostType[],
}) {
    const navigate = useNavigate();
    const [openPost, setOpenPost] = useState<boolean>(false);

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

    const isChainOpen = false; //default is false when rendered, should be toggled in redux state

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
                                        (user) => user.user_id === post.user_id
                                    )!.user_name
                                }
                                content={post.content}
                                location={post_location} //should come from map API
                                time={post.time}
                                reply_to={post.reply_to}
                                image={""}
                                chain_open={isChainOpen} //default is false when rendered
                                clickPost={() => clickPostHandler(post)}
                                // toggleChain={} for chain open/close w redux
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
