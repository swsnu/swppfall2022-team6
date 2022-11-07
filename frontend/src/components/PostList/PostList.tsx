import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostType } from "../../containers/AreaFeed/AreaFeed";
import Post from "../Post/Post";
import PostModal from "../PostModal/PostModal";
import "./PostList.scss";

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
        <div id="PostList" className="mt-3 w-60 m-auto">
            <div id="posts-container" className="d-flex flex-column gap-3 me-4">
                {allPosts.map((post) => {
                    return (
                        <div
                            key={post.id}
                            id="post-and-chain-container"
                            className="border border-1 rounded-5 p-2"
                        >
                            <Post
                                key={post.id}
                                id={post.id}
                                // TODO: user name from backend
                                user_name={post.user_name}
                                content={post.content}
                                location={post_location} //should come from map API
                                created_at={post.created_at}
                                reply_to={post.reply_to}
                                image={""}
                                clickPost={() => clickPostHandler(post)}
                                isReplyList={replyTo}
                            />
                        </div>
                    );
                })}
            </div>
            {type === "Mypage" ? null : (
                <div id="postlist-modal-container">
                    <button
                        id="add-post-button"
                        type="button"
                        className="btn btn-primary"
                        onClick={onClickAddPostButton}
                    >
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
