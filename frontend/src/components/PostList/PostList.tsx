import React from "react";

function PostList() {
    const onClickAddPostButton = () => {};
    return (
        <div id="PostList">
            <div id="PostsContainer"></div>
            <button id="add-post-button" onClick={onClickAddPostButton}>
                Add Post
            </button>
        </div>
    );
}

export default PostList;
