import React, { useState } from "react";
import { Chart } from "react-chartjs-2";
import { Navigate, useNavigate } from "react-router";


export interface postProps {
    id: number,
    user_name: string,
    content: string,
    image: string,    // image url, "" if none
    location: string,
    time: string,       // date & time string
    reply_to: number,    // id of the chained post, 0 if none
    chain_open: boolean, // default is false, sent from PostList
    clickPost?: React.MouseEventHandler<HTMLDivElement>; // Click the post
}
// get location from user lang, long

const Post = (post: postProps) => {
    
    const toggleChainHandler = () => {
        post.chain_open = !post.chain_open;
    };
    
    return (
    <div id="post-and-chain-container">
        <div id="post-container" onClick={post.clickPost}>
            <div id="user-container">
                <div id="user-main-badge"></div>
                <div id="user-name">
                    {post.user_name}
                </div>
                <div id="location">
                    {post.location}
                </div>
                <div id="timestamp">
                    {post.time}
                </div>
            </div>
            <div id="post-content-container">
                <div id="post-text">
                    {post.content}
                </div>
                <div id="post-photo">
                </div>
            </div>
        </div>
        <div id="chain-container">
            <div id="chained-posts">
            </div>
            <div id="chain-toggle">
                {post.reply_to === 0
                ? null
                : (post.chain_open === false 
                    ? <button id="chain-toggle-button">Show All</button>
                    : <button id="chain-toggle-button">Close All</button>)
                }
            </div>
        </div>
    </div>
    );
};

export default Post;