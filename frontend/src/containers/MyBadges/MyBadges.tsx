import React from "react";
import { useNavigate } from "react-router-dom";

function MyBadges() {
    const navigate = useNavigate();
    const onClickBackButton = () => {
        navigate("/mypage");
    };
    // const onClickBadge = () => {};
    const onClickSetAsMainBadgeButton = () => {};
    return (
        <div className="MyBadges">
            <button id="back-button" onClick={onClickBackButton}>
                Back
            </button>
            <div id="main-badge"></div>
            <div id="badge-list"></div>
            <button
                id="set-main-badge-button"
                onClick={onClickSetAsMainBadgeButton}
            >
                Set As Main Badge
            </button>
        </div>
    );
}

export default MyBadges;
