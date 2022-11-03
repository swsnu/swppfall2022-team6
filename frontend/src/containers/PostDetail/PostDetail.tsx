import React from "react";
import { useParams } from "react-router-dom";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import PostList from "../../components/PostList/PostList";

function PostDetail() {
    const postListCallback = () => {}; // axios.get again
    const { id } = useParams();
    return (
        <div className="PostDetail">
            <div id="upper-container"></div>
            <div id="post-container"></div>
            <div id="lower-post-container">
                <div id="hashtag-container"></div>
            </div>
            <PostList
                type={"Reply"}
                postListCallback={postListCallback}
                replyTo={Number(id)}
            />
            <NavigationBar />
        </div>
    );
}

export default PostDetail;
