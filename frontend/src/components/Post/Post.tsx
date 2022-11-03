import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostType } from "../PostList/PostList";

export interface postProps {
    id: number,
    user_name: string,
    content: string,
    image: string,              // image url, "" if none
    location: string,
    created_at: string,               // date & time string
    reply_to: number | null,           // id of the chained post
    chain_open: boolean,
    clickPost?: React.MouseEventHandler<HTMLDivElement>,
    toggleChain?: () => void    // toggle chain open/close
}
// get location from user lang, long

// get user from backend with user_id
const users: { user_name: string; user_id: number }[] = [
    { user_name: "WeatherFairy", user_id: 1 },
    { user_name: "Toothfairy", user_id: 2 },
];

const Post = (post: postProps) => {
    const navigate = useNavigate();
    // set chain toggle status
    const [isChainOpen, setChainOpen] = useState<boolean>(false);
    // get replied post
    const [chainedPosts, setChainedPosts] = useState<PostType[]>([
        {
            id: 1,
            user: 1,
            content:
                "지금 설입은 맑긴 한데 바람이 많이 불어요\n겉옷을 안 챙겨 나왔는데 학교도 춥나요? 자연대 쪽에...",
            latitude: 37.44877599087201,
            longitude: 126.95264777802309,
            created_at: new Date().toLocaleDateString(),
            image: "",
            reply_to: null,
            hashtag: [{id: 1, content: "Sunny"}]
        },
    ]);
    // useEffect(() => {
    //     // setChainedPosts();
    //     // call chain from backend
    // })
    useEffect(() => {}, [isChainOpen]);

    const clickPostHandler = (post: PostType) => {
        navigate("/areafeed/" + post.id);
    };
    const clickToggleChain = () => {
        setChainOpen(!isChainOpen);
        console.log('Chain toggled!')
    }
    const renderChainedPosts = (): JSX.Element[] => {
        const chain = chainedPosts.map((post: PostType)=> {
            return (
                <Post 
                    key={post.id}
                    id={post.id}
                    user_name={
                        users.find(
                            (user) => user.user_id === post.user
                        )!.user_name
                    }
                    content={post.content}
                    location={"Location"} //should come from map API
                    created_at={post.created_at}
                    reply_to={post.reply_to}
                    image={""}
                    chain_open={isChainOpen}
                    clickPost={() => clickPostHandler(post)}
                    toggleChain={() => clickToggleChain()}
                />
            );
        });
        return chain;
    }


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
                    {post.created_at}
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
        {/* Show chain when it is a reply */}
        { post.reply_to === null
        ? null
        : ((isChainOpen === false)
            ? <button 
                id="chain-toggle-button"
                onClick={clickToggleChain}>
                    Show All
              </button>
            : <div id="chain-container">
              <div id="chained-posts"> { 
                post.reply_to === 0
                ? null
                : renderChainedPosts()
              }
              </div>
              <div id="chain-toggle">
                <button 
                    id="chain-toggle-button"
                    onClick={clickToggleChain}>
                        Close All
                </button>
              </div>
          </div>
          )
        }
    </div>
    );
};

export default Post;