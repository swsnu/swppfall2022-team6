import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostList from "../../components/PostList/PostList";
import { PostType } from "../AreaFeed/AreaFeed";

function MyPage() {
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
    const onClickBackButton = () => {
        navigate("/");
    };
    const onClickSeeBadgesButton = () => {};
    const onClickLogOutButton = () => {};
    const onSelectOnlyPhotos = () => {};
    return (
        <div className="MyPage">
            <button id="back-button" onClick={onClickBackButton}>
                Back
            </button>
            <div id="upper-container">
                <div id="user-container"></div>
                <button id="see-badges-button" onClick={onClickSeeBadgesButton}>
                    See Badges
                </button>
                <button id="logout-button" onClick={onClickLogOutButton}>
                    Log Out
                </button>
            </div>
            <button id="only-photos-button" onClick={onSelectOnlyPhotos}>
                Only Photos
            </button>
            <PostList type={"Mypage"} postListCallback={() => {}} replyTo={0} allPosts={allPosts}/>
        </div>
    );
}

export default MyPage;
