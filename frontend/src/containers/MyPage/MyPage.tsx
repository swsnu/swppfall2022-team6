import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostList from "../../components/PostList/PostList";
import { PostType } from "../../store/slices/post";

function MyPage() {
    const navigate = useNavigate();
    const [allPosts, setAllPosts] = useState<PostType[]>([]);
    const onClickBackButton = () => {
        navigate("/");
    };
    const onClickSeeBadgesButton = () => {};
    const onClickLogOutButton = () => {
        axios
        .post('/user/signout/')
        .then(() => {
            window.sessionStorage.clear();
            window.location.reload();
        })
        .catch((error) => {
            console.log(error);
        });
    };
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
            {/* <PostList
                type={"Mypage"}
                postListCallback={() => {}}
                replyTo={0}
                allPosts={allPosts}
            /> */}
        </div>
    );
}

export default MyPage;
