import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostType } from "../../containers/AreaFeed/AreaFeed";
import axios from "axios";

export interface postProps {
    id: number;
    user_name: string;
    content: string;
    image: string; // image url, "" if none
    location: string;
    created_at: string; // date & time string
    reply_to: number | null; // id of the chained post
    clickPost?: React.MouseEventHandler<HTMLDivElement>;
    toggleChain?: () => void; // toggle chain open/close
}
// get location from user lang, long

// get user from backend with user_id
const users: { user_name: string; user_id: number }[] = [
    { user_name: "WeatherFairy", user_id: 1 },
    { user_name: "Toothfairy", user_id: 2 },
];

function Post(post: postProps) {
    const navigate = useNavigate();
    // set chain toggle status
    const [isChainOpen, setChainOpen] = useState<boolean>(false);
    // get replied post
    const [chainedPosts, setChainedPosts] = useState<PostType[]>([]);
    useEffect(() => {
        axios
            .get(`/post/${post.id}/chain/`)
            .then((response)=>{
                setChainedPosts(response.data)
            })
    });
    useEffect(() => {}, [isChainOpen]);

    const clickPostHandler = (post: PostType) => {
        navigate("/areafeed/" + post.id);
    };
    const clickToggleChain = () => {
        setChainOpen(!isChainOpen);
    };
    const renderChainedPosts = (): JSX.Element[] => {
        const chain = chainedPosts.map((post: PostType) => {
            return (
                <Post
                    key={post.id}
                    id={post.id}
                    user_name={
                        users.find((user) => user.user_id === post.user)!
                            .user_name
                    }
                    content={post.content}
                    location={"Location"} //should come from map API
                    created_at={post.created_at}
                    reply_to={post.reply_to}
                    image={""}
                    clickPost={() => clickPostHandler(post)}
                />
            );
        });
        return chain;
    };

    return (
        <div id="post-and-chain-container">
            <div id="post-container" onClick={post.clickPost}>
                <div id="user-container">
                    <div id="user-main-badge"></div>
                    <div id="user-name">{post.user_name}</div>
                    <div id="location">{post.location}</div>
                    <div id="timestamp">{post.created_at}</div>
                </div>
                <div id="post-content-container">
                    <div id="post-content">
                        { post.reply_to === null
                        ? null
                        : <span id="post-reply-to">
                            @{
                            users.find(
                                (user) => user.user_id === post.reply_to
                            )!.user_name
                            } </span>
                        }
                        <span id="post-text">{post.content}</span>
                    </div>
                    <div id="post-photo">
                        <img src={post.image}></img>
                    </div>
                </div>
            </div>
            {/* Show chain when it is a reply */}
            {post.reply_to === null ? null : isChainOpen === false ? (
                <button id="chain-toggle-button" onClick={clickToggleChain}>
                    Show All
                </button>
            ) : (
                <div id="chain-container">
                    <div id="chained-posts">
                        {renderChainedPosts()}
                    </div>
                    <div id="chain-toggle">
                        <button
                            id="chain-toggle-button"
                            onClick={clickToggleChain}
                        >
                            Close All
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Post;
