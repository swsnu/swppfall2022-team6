import React, { useState } from "react";
import { useParams } from "react-router-dom";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import PostList from "../../components/PostList/PostList";
import { PostType } from "../AreaFeed/AreaFeed";

function PostDetail() {
    const postListCallback = () => {}; // axios.get again
    const { id } = useParams();
    const [allPosts, setAllPosts] = useState<PostType[]>([
        {
            id: 3,
            user_id: 3,
            content: "content",
            latitude: 30,
            longitude: 125,
            time: new Date().toLocaleDateString(),
            reply_to: 2,
            image: "",
        },
    ]);
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
                allPosts={allPosts}
            />
            <NavigationBar />
        </div>
    );
}

export default PostDetail;
