import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostList from "../../components/PostList/PostList";
import { PostType } from "../../store/slices/post";
import { setLogout } from "../../store/slices/user";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";

function MyPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [allPosts, setAllPosts] = useState<PostType[]>([]);

    const onClickBackButton = () => {
        navigate("/");
    };
    const onClickSeeBadgesButton = () => {};
    const onClickLogOutButton = async () => {
        await dispatch(setLogout());
    };
    const onSelectOnlyPhotos = () => {};
    return (
        <div className="MyPage">
            <button id="back-button" onClick={e => onClickBackButton}>
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
