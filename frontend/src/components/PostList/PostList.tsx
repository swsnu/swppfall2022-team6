import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Post from "../Post/Post";

type PostType = {
    id: number,
    user_id: number,
    content: string,
    image: string,    // image url
    latitude: number,
    longitude: number,
    time: string, // date string
    reply_to: number    // id of the chained post
};

function PostList() {
    const onClickAddPostButton = () => {}; // should be implemented with postModal
    const navigate = useNavigate();
    

    const [allPosts, setAllPosts] = useState<PostType[]>([
        {
            id: 2,
            user_id: 2,
            content: "학교는 많이 춥네요ㅠㅠ\n겉옷 챙기시는게 좋을 것 같아요!",
            latitude: 37.44877599087201,
            longitude: 126.95264777802309,
            time: new Date().toLocaleDateString(),
            reply_to: 1,
            image: "",
        },
        {
            id: 1,
            user_id: 1,
            content:
                "지금 설입은 맑긴 한데 바람이 많이 불어요\n겉옷을 안 챙겨 나왔는데 학교도 춥나요? 자연대 쪽에...",
            latitude: 37.44877599087201,
            longitude: 126.95264777802309,
            time: new Date().toLocaleDateString(),
            image: "",
            reply_to: 0,
        },
    ]);

    // get user from backend with user_id
    const users: {user_name: string, user_id: number}[] = [
        {"user_name": 'WeatherFairy', "user_id": 1},
        {"user_name": 'Toothfairy', "user_id": 2}
    ];

    const post_location = "Bongcheon-dong, Gwanak-gu"; //should be implemented with Map API, 

    const clickPostHandler = (post: PostType) => {
        navigate("/areafeed/" + post.id);
    };

    const isChainOpen = false;  //default is false when rendered, should be toggled in redux state

    return (
        <div id="PostList">
            <div id="PostsContainer">
                <div id="posts">
                    {allPosts.map((post) => {
                        return (
                            <Post
                                key={post.id}
                                id={post.id}
                                user_name={users.find((user) => user.user_id == post.user_id)!.user_name}
                                content={post.content}
                                location={post_location} //should come from map API
                                time={post.time}
                                reply_to={post.reply_to}
                                image={""}
                                chain_open={isChainOpen}  //default is false when rendered
                                clickPost={() => clickPostHandler(post)}
                                // toggleChain={} for chain open/close w redux
                            />
                        );
                    })}
                </div>
            </div>
            <button id="add-post-button" onClick={onClickAddPostButton}>
                Add Post
            </button>
        </div>
    );
}

export default PostList;