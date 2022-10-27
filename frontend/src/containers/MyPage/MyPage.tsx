import React from "react";
import { useNavigate } from "react-router-dom";
import PostList from "../../components/PostList/PostList";

function MyPage() {
    const navigate = useNavigate();
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
            <PostList />
        </div>
    );
}

export default MyPage;
