import React, { useState } from "react";
import Map from "./../../components/Map/Map";
import InputSlider from "react-input-range";
import { useNavigate } from "react-router-dom";

function MainPage() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const navigate = useNavigate();

    const onClickMyPageIcon = () => {
        navigate("/mypage");
    };
    const onChangeMapRadius = () => {};
    const onSubmitSearchBox = (e: React.KeyboardEvent<HTMLInputElement>) => {
        //if (e.key === "Enter") {}
    };
    const onClickFindOutButton = () => {};
    const onClickReportButton = () => {};

    return (
        <div className="MainPage">
            <div id="upper-container">
                NowSee
                <button id="mypage-button" onClick={onClickMyPageIcon}>
                    MyPage
                </button>
            </div>
            <div id="search-box-container">
                <input
                    id="search-box"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => onSubmitSearchBox(e)}
                />
            </div>
            <Map />
            <div id="lower-map-container">
                <div id="range-slider"></div>
                <button id="findout-button" onClick={onClickFindOutButton}>
                    Find out
                </button>
            </div>
            <div id="bottom-container">
                <span>Current location: </span>
                <button id="report-button" onClick={onClickReportButton}>
                    Report
                </button>
            </div>
        </div>
    );
}

export default MainPage;
