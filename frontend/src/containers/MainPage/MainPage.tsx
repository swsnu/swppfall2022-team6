import React, { useState } from "react";
import Map from "./../../components/Map/Map";
import InputSlider from "react-input-range";

function MainPage() {
    const [searchQuery, setSearchQuery] = useState<string>("");

    const onClickMyPageIcon = () => {};
    const onChangeMapRadius = () => {};
    const onSubmitSearchBox = (e: React.KeyboardEvent<HTMLInputElement>) => {
        //if (e.key === "Enter") {}
    };
    const onClickFindOutButton = () => {};
    const onClickReportButton = () => {};

    return (
        <div id="MainPage">
            <div id="UpperContainer">
                NowSee
                <button id="mypage-button" onClick={() => onClickMyPageIcon()}>
                    MyPage
                </button>
            </div>
            <div id="SearchBoxContainer">
                <input
                    id="search-box"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => onSubmitSearchBox(e)}
                />
            </div>
            <Map />
            <div id="LowerMapContainer">
                <div id="range-slider"></div>
                <button
                    id="findout-button"
                    onClick={() => onClickFindOutButton()}
                >
                    Find out
                </button>
            </div>
            <div id="BottomContainer">
                <span>Current location: </span>
                <button
                    id="report-button"
                    onClick={() => onClickReportButton()}
                >
                    Report
                </button>
            </div>
        </div>
    );
}

export default MainPage;
