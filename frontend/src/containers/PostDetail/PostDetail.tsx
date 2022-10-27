import React from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import PostList from "../../components/PostList/PostList";

function PostDetail() {
    return (
        <div className="PostDetail">
            <div id="upper-container"></div>
            <div id="post-container"></div>
            <div id="lower-post-container">
                <div id="hashtag-container"></div>
                <button id="add-reply-button">Add Reply</button>
            </div>
            <PostList />
            <NavigationBar />
        </div>
    );
}

export default PostDetail;
