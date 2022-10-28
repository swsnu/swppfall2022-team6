import React from "react";

export interface PostType {
    id: number;
    user_id: number;
    content: string;
    image?: string; // image url
    latitude: number;
    longitude: number;
    time: string; // date string
    reply_to: number; // id of the chained post
    chain_open?: boolean; // chain_open should not be implemented in back though?
    clickPost?: React.MouseEventHandler<HTMLDivElement>; // Click the post
}

// get user from backend with user_id
const users: { user_name: string; user_id: number }[] = [
    { user_name: "WeatherFairy", user_id: 1 },
    { user_name: "Toothfairy", user_id: 2 },
];

// get location from user lang, long
const post_location = "Bongcheon-dong, Gwanak-gu";

const Post = (post: PostType) => {
    const user = users.find((user) => user.user_id === post.user_id);
    // const toggleChainHandler = () => {
    //     post.chain_open = !post.chain_open;
    // };

    return (
        <div id="post-container" onClick={post.clickPost}>
            <div id="user-container">
                <div id="user-main-badge"></div>
                <div id="user-name">{user?.user_name}</div>
                <div id="location">{post_location}</div>
                <div id="timestamp">{post.time}</div>
            </div>
            <div id="post-content-container">
                <div id="post-text">{post.content}</div>
                <div id="post-photo"></div>
            </div>
            <div id="chain-container">
                <div id="chained-posts"></div>
                <div id="chain-toggle">
                    {post.reply_to === 0 ? null : post.chain_open === true ? (
                        <button id="chain-toggle-button">Show All</button>
                    ) : (
                        <button id="chain-toggle-button">Close All</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Post;
