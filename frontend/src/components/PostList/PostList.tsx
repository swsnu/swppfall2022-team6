import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { PostType } from "../../store/slices/post";
import Post from "../Post/Post";
import PostModal from "../PostModal/PostModal";
import "./PostList.scss";
import { PositionType } from "../../store/slices/position";

function PostList({
    currPosition,
    type,
    postListCallback,
    replyTo,
    allPosts,
}: {
    currPosition: PositionType | null;
    type: string;
    postListCallback: () => void;
    replyTo: number;
    allPosts: PostType[];
}) {
    const navigate = useNavigate();
    const [openPost, setOpenPost] = useState<boolean>(false);

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
        <Container id="PostList" className="mt-3 w-95 m-auto">
            <div id="posts-container" className="d-flex flex-column gap-3 me-4">
                {allPosts.map((post) => {
                    return (
                        <Row
                            key={post.id}
                            className="post-and-chain-container ms-0"
                            // className="border border-1 rounded-5 p-2"
                        >
                            <Post
                                key={post.id}
                                id={post.id}
                                user_name={post.user_name}
                                badge_id={post.badge_id}
                                content={post.content}
                                location={post.location}
                                created_at={post.created_at}
                                reply_to_author={post.reply_to_author}
                                image={post.image}
                                clickPost={() => clickPostHandler(post)}
                                isReplyList={replyTo}
                            />
                        </Row>
                    );
                })}
            </div>
            {type === "Mypage" ? null : (
                <div id="postlist-modal-container">
                    <button
                        id="add-post-button"
                        type="button"
                        // className="btn btn-primary"
                        onClick={onClickAddPostButton}
                    >
                        Add {type}
                    </button>
                    <PostModal
                        currPosition= {currPosition}
                        openPost={openPost}
                        setOpenPost={setOpenPost}
                        postModalCallback={postModalCallback}
                        type={type}
                        replyTo={replyTo}
                    />
                </div>
            )}
        </Container>
    );
}

export default PostList;
